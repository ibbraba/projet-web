/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { Subject, timer } from 'rxjs';
import * as amqp from 'amqplib';

@Injectable()
export class UserProducerService implements OnModuleInit, OnModuleDestroy {
  private client: ClientProxy;
  private logger = new Logger(UserProducerService.name);

  private pendingResponses = new Map<string, Subject<any>>();

  private amqpConnection: amqp.Connection;
  private amqpChannel: amqp.Channel;

  async onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:password123@localhost:5672'],
        queue: 'user.queue',
        queueOptions: { durable: false },
      },
    });

    await this.client.connect();

    await this.initResponseConsumer();
  }

  async onModuleDestroy() {
    await this.client.close();
    if (this.amqpChannel) await this.amqpChannel.close();
    if (this.amqpConnection) await this.amqpConnection.close();
  }

  async send(action: string, payload: any): Promise<any> {
    const idRequete = uuidv4();
    const message = { idRequete, action, data: payload };

    this.logger.log(`Envoi message action=${action} idRequete=${idRequete}`);

    const response$ = new Subject<any>();
    this.pendingResponses.set(idRequete, response$);

    // IMPORTANT : utiliser send pour recevoir une réponse
    this.client.send(action, message).subscribe({
      next: (res) => response$.next(res),
      error: (err) => response$.error(err),
    });

    const timeout = timer(5000).subscribe(() => {
      if (this.pendingResponses.has(idRequete)) {
        response$.error(new Error('Timeout waiting for response'));
        this.pendingResponses.delete(idRequete);
      }
    });

    return new Promise((resolve, reject) => {
      response$.subscribe({
        next: (res) => {
          timeout.unsubscribe();
          this.pendingResponses.delete(idRequete);
          resolve(res);
        },
        error: (err) => {
          timeout.unsubscribe();
          this.pendingResponses.delete(idRequete);
          reject(err);
        },
      });
    });
  }

  private async initResponseConsumer() {
    this.amqpConnection = await amqp.connect('amqp://admin:password123@localhost:5672');
    this.amqpChannel = await this.amqpConnection.createChannel();

    await this.amqpChannel.assertQueue('user.response', { durable: false });

    this.amqpChannel.consume('user.response', (msg) => {
      if (msg !== null) {
        try {
          const content = msg.content.toString();
          const message = JSON.parse(content);
          this.handleResponse(message);
          this.amqpChannel.ack(msg);
        } catch (err) {
          this.logger.error('Erreur traitement message response', err);
          this.amqpChannel.nack(msg, false, false);
        }
      }
    });
  }

  handleResponse(message: any) {
    const { idRequete, ...data } = message;
    if (idRequete && this.pendingResponses.has(idRequete)) {
      this.logger.log(`Réponse reçue idRequete=${idRequete}`);
      const subject = this.pendingResponses.get(idRequete);
      if (subject) {
        subject.next(data);
        subject.complete();
      }
      this.pendingResponses.delete(idRequete);
    } else {
      this.logger.warn(`Réponse inconnue pour idRequete=${idRequete}`);
    }
  }
}
