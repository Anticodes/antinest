import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AccessStrategy, RefreshStrategy, ResetStrategy } from "./strategies";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot(),
        JwtModule.register({}),
        NotificationModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessStrategy, RefreshStrategy, ResetStrategy],
})
export class AuthModule {}
