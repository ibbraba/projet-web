import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Global() // Optionnel : rend le service disponible globalement
@Module({
    providers: [RabbitMQService],
    exports: [RabbitMQService], // Important pour pouvoir l'utiliser ailleurs
})
export class RabbitMQModule {
    constructor() {
        console.log('Rabbitmq module initialized');
        
    }
}