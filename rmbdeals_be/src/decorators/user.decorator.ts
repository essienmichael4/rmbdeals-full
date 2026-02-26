import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface UserInfo{
    username: string,
    sub: {
      id: number,
      name: string,
      role: string
    }
  }

export const User = createParamDecorator((data, context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest()
    return request.user
})
