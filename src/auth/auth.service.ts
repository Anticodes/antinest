import { Injectable } from "@nestjs/common";
import { CreateUser, LoginUser } from "./types/transfer.types";

@Injectable()
export class AuthService {
    login(user: LoginUser) {}
    register(user: CreateUser) {}
    refresh(refreshToken: string) {}
    logout() {}
    forgot(email: string) {}
    reset() {}
}
