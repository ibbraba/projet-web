import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {CreateNotificationInput} from "../dto/create-notification.input";
import {RabbitMQService} from "../../../core/rabbitmq/rabbitmq.service";
import {Notification} from "../models/notification.model";
import {Message} from "../../messages/models/message.model";

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    public readonly notificationQueue: string = 'message.queue';
    public readonly notificationReplyQueue: string = 'message.response';
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) {}
    async create(
        input: CreateNotificationInput
    ) {
        const request = {
            message: input.message,
            recipient: input.recipient,
            notificationType: input.notificationType,
            sender: input.sender || null
        };

        return await this.rabbitMQService.sendWithReply(this.notificationQueue, this.notificationReplyQueue, 'create', request);
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        return await this.rabbitMQService.sendWithReply(this.notificationQueue, this.notificationReplyQueue, 'findAll', userId);
    }

    public async findNotificationById(notificationId: string): Promise<Notification> {
        return await this.rabbitMQService.sendWithReply(this.notificationQueue, this.notificationReplyQueue, 'findOne', notificationId);
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