import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class ResetStrategy extends PassportStrategy(Strategy, "jwt-reset") {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>("RESET_TOKEN_SECRET"),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const resetToken = req
            .get("authorization")
            .replace("Bearer", "")
            .trim();
        return {
            ...payload,
            resetToken,
        };
    }
}
