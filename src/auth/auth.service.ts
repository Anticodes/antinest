import { Injectable, ForbiddenException } from "@nestjs/common";
import { CreateUser, LoginUser } from "./types/transfer.types";
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
            user.password,
            userData.password,
        );
        if (!correctPassword)
            throw new ForbiddenException("Access Denied " + userData.password);

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async register(user: CreateUser) {
        const hash = await this.hashData(user.password);

        const newUser = await this.prismaService.user.create({
            data: { ...user, password: hash },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);

        await this.updateRefreshHash(newUser.id, tokens.refresh_token);

        return tokens;
    }
    refresh(refreshToken: string) {
        return refreshToken;
    }
    logout() {}
    forgot(email: string) {
        return email;
    }
    reset() {}

    async getTokens(userId: number, email: string) {
        const payload = {
            sub: userId,
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

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
}
