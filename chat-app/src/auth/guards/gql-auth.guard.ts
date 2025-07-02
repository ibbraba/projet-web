// src/auth/gql-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req; // Transforme le contexte GraphQL en requête standard
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Accès refusé');
        }
        return user; // Injecte l'utilisateur dans `@CurrentUser()`
    }
}