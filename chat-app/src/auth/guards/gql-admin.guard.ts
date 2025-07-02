// src/auth/guards/gql-admin.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import {User} from "../../modules/users/models/user.model";

@Injectable()
export class GqlAdminGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Appel parent pour vérifier le JWT
        const parentCanActivate = await super.canActivate(context);
        if (!parentCanActivate) {
            return false;
        }

        // Vérification du rôle admin
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user as User; // Typage explicite

        if (!user?.isAdmin) {
            throw new UnauthorizedException('Admin privileges required');
        }

        return true;
    }
}