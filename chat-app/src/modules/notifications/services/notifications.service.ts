import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateNotificationInput} from "../dto/create-notification.input";
import {RabbitMQService} from "../../../core/rabbitmq/rabbitmq.service";
import {Notification} from "../models/notification.model";

@Injectable()
export class NotificationsService {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) {}
    private readonly notifications: Notification[] = [];
    // Création
    async create(
        input: CreateNotificationInput
    ) {
        // Logique de création + envoi en temps réel
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