import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ForgotPassword {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ResetPassword {
    @IsNotEmpty()
    @IsString()
    password: string;
}

export type Tokens = {
    access_token: string;
    refresh_token: string;
};

export type JwtPayload = {
    id: number;
    email: string;
};
