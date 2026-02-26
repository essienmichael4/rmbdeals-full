import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector:Reflector, private jwtService:JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const roles = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass()
        ])

        if(roles?.length){
            const request = context.switchToHttp().getRequest()
            const token = this.extractTokenFromHeader(request)
            if(!token) throw new UnauthorizedException()

            try{
                const payload = this.jwtService.verify(token, {
                    secret: process.env.JWT_SECRET_KEY
                })
                
                if(roles.includes(payload?.sub?.role)) return true
            }catch(e){
                throw new UnauthorizedException()
            }
        }

        return true
    }
    
    private extractTokenFromHeader(request:Request){
        const [type, token] = request?.headers?.authorization?.split(" ") ?? []
        return type == "Bearer" ? token : undefined
    }
}
