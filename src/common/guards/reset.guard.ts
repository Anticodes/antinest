import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ResetGuard extends AuthGuard("jwt-reset") {}
