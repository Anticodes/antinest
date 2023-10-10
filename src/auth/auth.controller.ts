import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUser, LoginUser } from "./types/transfer.types";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    login(@Body() user: LoginUser) {
        return this.authService.login(user);
    }

    @Post("register")
    register(@Body() user: CreateUser) {
        return this.authService.register(user);
    }

    @Post("refresh")
    refresh(@Body("token") refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }

    @Post("logout")
    logout() {
        return this.authService.logout();
    }

    @Post("forgot")
    forgot(@Body("email") email: string) {
        return this.authService.forgot(email);
    }

    @Post("reset")
    reset() {
        return this.authService.reset();
    }
}
