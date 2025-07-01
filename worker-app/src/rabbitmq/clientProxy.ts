import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class PublisherService implements OnModuleInit {
  private client1: ClientProxy;
  private client2: ClientProxy;

  onModuleInit() {
/*    this.client1 = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'queue_1',
        queueOptions: { durable: true },
      },

    });

    this.client2 = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'queue_2',
        queueOptions: { durable: true },
      },
    });
    */
  }

  async publishToQueue1(data: any) {
    await this.client1.emit('pattern1', data).toPromise();
  }

  async publishToQueue2(data: any) {
    await this.client2.emit('pattern2', data).toPromise();
  }
}
