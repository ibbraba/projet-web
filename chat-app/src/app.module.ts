import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import {UsersModule} from "./modules/users/users.module";
import {ConversationsModule} from "./modules/conversations/conversations.module";
import {MessagesModule} from "./modules/messages/messages.module";
import {ApolloDriver} from "@nestjs/apollo";
import {AuthModule} from "./auth/auth.module";


@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // Génère le schéma automatiquement
      playground: true,
      driver: ApolloDriver,
      cors: { origin: 'http://localhost:3000', credentials: true,}, // Désactive CORS pour éviter les problèmes de sécurité
    }),
    UsersModule,          // Import des modules
    ConversationsModule,  // → Leurs resolvers sont chargés automatiquement
    MessagesModule,
    AuthModule,
  ],
})
export class AppModule {}