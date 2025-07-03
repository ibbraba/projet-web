import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {CreateNotificationInput} from "../dto/create-notification.input";
import {RabbitMQService} from "../../../core/rabbitmq/rabbitmq.service";
import {Notification} from "../models/notification.model";
import {Message} from "../../messages/models/message.model";

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) {}
    private readonly notifications: Notification[] = [];
    // Création
    async create(
        input: CreateNotificationInput
    ) {
        const response = await this.rabbitMQService.sendWithReply('notification.send', {
            message: input.message,
            recipient: input.recipient,
            notificationType: input.notificationType,
            createdAt: new Date(),
        });

        // 2. Publier l'événement de création
        await this.publishNotificationCreated(response.message);

        return response.message;
    }

    private async publishNotificationCreated(message: Message): Promise<void> {
        try {
            await this.rabbitMQService.send('message.created', {
                event: 'MESSAGE_CREATED',
                data: {
                    messageCreated: message
                }
            });
        } catch (error) {
            this.logger.error(`Failed to publish message: ${error.message}`);
            // Système de retry pourrait être implémenté ici
        }
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notifications.filter(
            n => n.recipient.id === userId
        );
    }

    public async findNotificationById(notificationId: string): Promise<Notification> {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) {
            throw new NotFoundException(`User with ID ${notificationId} not found`);
        }
        return notification;
    }

    // Mise à jour
    async markAsRead(id: string) {
        // Met à jour le flag 'read'
    }

    // Suppression
    async delete(id: string){
        // Supprime de la base
    }
}