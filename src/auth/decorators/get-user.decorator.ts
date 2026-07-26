import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to easily access authenticated user from request context
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);