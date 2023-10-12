import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
    CreateUser,
    ForgotPassword,
    LoginUser,
    ResetPassword,
} from "./types/auth.types";
import { RefreshGuard, ResetGuard } from "src/common/guards";
import { GetUser } from "src/common/decorators/get-user.decorator";
import { Public } from "src/common/decorators";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/notification/email.service";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private emailService: EmailService,
        private config: ConfigService,
    ) {}

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() user: LoginUser) {
        return this.authService.login(user);
    }

    @Public()
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() user: CreateUser) {
        return this.authService.register(user);
    }

    @Public()
    @UseGuards(RefreshGuard)
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    refresh(
        @GetUser("id") userId: number,
        @GetUser("refreshToken") refreshToken: string,
    ) {
        return this.authService.refresh(userId, refreshToken);
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(@GetUser("id") userId: number) {
        return this.authService.logout(userId);
    }

    @Public()
    @Post("forgot")
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() { email }: ForgotPassword) {
        const resetToken = await this.authService.forgotPassword(email);

        //Send email to the user if token exists
        if (resetToken) {
            const link = `${this.config.get<string>(
                "APP_URL",
            )}/reset-password?t=${resetToken}`;

            //TODO: implement email service then use it here
            this.emailService.sendEmail(
                "Forgot Password",
                `<h1>Dear User</h1>Did you forgot your password?<br/><br/>Here is the <a style="text-decoration: none;" href="${link}">link</a>`,
                email,
            );
        }

        return true;
    }

    @Public()
    @UseGuards(ResetGuard)
    @Post("reset")
    @HttpCode(HttpStatus.OK)
    resetPassword(
        @GetUser("id") userId: number,
        @GetUser("resetToken") resetToken: string,
        @Body() { password }: ResetPassword,
    ) {
        return this.authService.resetPassword(userId, resetToken, password);
    }
}
