import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {UsersService} from "../services/users.service";
import {User} from "../models/user.model";
import {CreateUserInput} from "../dto/create-user.input";
import {UpdateUserInput} from "../dto/update-user.input";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../auth/guards/gql-auth.guard";
import {GqlAdminGuard} from "../../../auth/guards/gql-admin.guard";
import {CurrentUser} from "../../../auth/decorators/current-user.decorator";
import {ForbiddenError} from "@nestjs/apollo";

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User], { name: 'getUsers', description: 'Fetch all users', })
    @UseGuards(GqlAuthGuard, GqlAdminGuard) // Double protection
    async getUsers() {
        return this.usersService.findAll();
    }

    /*
    @Query(() => User, { name: 'getMe', description: 'Fetch current user', })
    @UseGuards(GqlAuthGuard) // Protection par garde JWT
    async getMe(@CurrentUser() user: User) {
        return this.usersService.refreshUserData(user); // Optionnel : données fraîches
    }
    */
    // Note: getMe is commented out because it is not used in the current context.
    @Query(() => User, { name: 'getUser', description: 'Fetch one user by id', })
    @UseGuards(GqlAuthGuard, GqlAdminGuard)
    async getUser(@Args('id') id: string, @CurrentUser() currentUser: User) {
        // 1. L'admin peut tout voir
       /* if (currentUser.isAdmin) {
            return this.usersService.findUserById(id);
        }
        */
        // 2. Un utilisateur peut voir son propre profil complet
        if (currentUser.id === id) {
            return this.usersService.findUserById(id);
        }

        // 3. Pour les autres cas: retourner seulement les informations publiques
        /*
        return this.usersService.findPublicProfile(id);
        */
    }

    @Mutation(() => User, { name: 'createUser', description: 'Create one user', }) // Convention camelCase
    async createUser(@Args('input') input: CreateUserInput) {
        return this.usersService.create(input);
    }

    async updateUser(input: UpdateUserInput) {

    }
}
