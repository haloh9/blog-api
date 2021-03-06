import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { UserService } from "../user.service";


@Injectable()
export class AuthGaurd implements CanActivate {

    constructor(
        private readonly userService: UserService
      ) { }
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if(!request.headers.authorization || request.headers.authorization.split(' ')[0] != 'Bearer')
            return false;
        console.log(this.userService.getLoggedUser());
        const token = request.headers.authorization.split(' ')[1];
        const decoded = await this.validateToken(token);
        return decoded;
    }

    async validateToken(token: string){
        try{
            const decoded = await jwt.verify(token, 'mySalt');
            return decoded;
        } catch(e) {
            console.error('Invalid token');
        }

    }
}