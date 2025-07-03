import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { Notification } from '../models/notification.model';
import { NotificationsService } from "../services/notifications.service";
import { PUB_SUB } from "../../../common/constants";
import { PubSub } from "graphql-subscriptions";

@Resolver(() => Notification)
export class NotificationsResolver {
    constructor(
        private readonly notificationsService: NotificationsService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub // Virgule ajoutée ici
    ) {}

    @Query(() => [Notification], {
        name: 'notificationsForUser',
        description: 'Get all notifications of one user'
    })
    async getNotificationsForUser(
        @Args('userId') userId: string,
        @Args('unreadOnly', { nullable: true }) unreadOnly?: boolean
    ): Promise<Notification[]> {
        return this.notificationsService.getUserNotifications(userId);
    }

    @Query(() => Notification, { name: 'getNotification' })
    async getNotification(
        @Args('id') id: string
    ): Promise<Notification> {
        return this.notificationsService.findNotificationById(id);
    }

    @Mutation(() => Notification, { name: 'markNotificationAsRead' })
    async markAsRead(
        @Args('id') id: string
    ): Promise<void> {
        return this.notificationsService.markAsRead(id);
    }

    @Mutation(() => Boolean, { name: 'deleteNotification' })
    async deleteNotification(
        @Args('id') id: string
    ): Promise<void> {
        return this.notificationsService.delete(id);
    }

    @Subscription(() => Notification, {
        name: 'newNotification',
        filter: (payload: { newNotification: Notification }, variables: { userId: string }) => {
            return payload.newNotification.recipient.id === variables.userId;
        }
    })
    newNotification(
        @Args('userId') userId: string
    ) {
        return this.pubSub.asyncIterableIterator('NEW_NOTIFICATION'); // Utilisation directe de pubSub
    }
}