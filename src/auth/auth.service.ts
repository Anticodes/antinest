import {
    Injectable,
    ForbiddenException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { CreateUser, LoginUser } from "./types/auth.types";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async login(userData: LoginUser) {
        const user = await this.prismaService.user.findUnique({
            where: { email: userData.email },
        });

        if (!user) throw new ForbiddenException("Access Denied");

        const correctPassword = await bcrypt.compare(
            userData.password,
            user.password,
        );
        if (!correctPassword) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async register(user: CreateUser) {
        const hash = await this.hashData(user.password);

        const newUser = await this.prismaService.user
            .create({
                data: { ...user, password: hash },
            })
            .catch(() => {
                throw new UnprocessableEntityException("Email already exists");
            });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshHash(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async refresh(userId: number, refreshToken: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.refreshHash)
            throw new ForbiddenException("Access Denied");

        const sameRefreshToken = await bcrypt.compare(
            refreshToken,
            user.refreshHash,
        );

        if (!sameRefreshToken) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        this.updateRefreshHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: number) {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { refreshHash: null },
        });
        return true;
    }

    async forgotPassword(email: string): Promise<string | undefined> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        //Requester shouldn't know if requested email exists or not, so no exceptions
        if (!user) return;

        const payload = { id: user.id, email: user.email };

        const resetToken = await this.jwtService.signAsync(payload, {
            secret: this.config.get<string>("RESET_TOKEN_SECRET"),
            expiresIn: "1d",
        });

        this.updateResetHash(user.id, resetToken);

        return resetToken;
    }

    async resetPassword(userId: number, resetToken: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.resetHash)
            throw new ForbiddenException("Access Denied");

        const sameResetToken = await bcrypt.compare(resetToken, user.resetHash);

        if (!sameResetToken) throw new ForbiddenException("Access Denied");

        const hash = await this.hashData(password);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { resetHash: null, password: hash },
        });

        return true;
    }

    async getTokens(userId: number, email: string) {
        const payload = {
            id: userId,
            email,
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
                expiresIn: "15m",
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
                expiresIn: "7d",
            }),
        ]);

        return { access_token, refresh_token };
    }

    async updateRefreshHash(userId: number, refresh: string) {
        const hash = await this.hashData(refresh);

        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshHash: hash,
            },
        });
    }

    async updateResetHash(userId: number, reset: string) {
        const hash = await this.hashData(reset);

        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                resetHash: hash,
            },
        });
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
}
