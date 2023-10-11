import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>("ACCESS_TOKEN_SECRET"),
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
