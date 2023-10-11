import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AccessGuard } from "./common/guards";

@Module({
    imports: [AuthModule, PrismaModule, ConfigModule.forRoot()],
    providers: [{ provide: APP_GUARD, useClass: AccessGuard }],
})
export class AppModule {}
