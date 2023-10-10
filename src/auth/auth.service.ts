import { Injectable, ForbiddenException } from "@nestjs/common";
import { CreateUser, LoginUser } from "./types/transfer.types";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async login(userData: LoginUser) {
        const user = await this.prismaService.user.findFirst({
            where: { email: userData.email },
        });

        if (!user) {
            throw new ForbiddenException("Access denied");
        }

        if (user.password === userData.password) {
            return "muekkemlelll";
        }
    }
    register(user: CreateUser) {
        return this.prismaService.user.create({ data: user });
    }
    refresh(refreshToken: string) {
        return refreshToken;
    }
    logout() {}
    forgot(email: string) {
        return email;
    }
    reset() {}
}
