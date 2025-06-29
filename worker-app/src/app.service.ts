import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConversationService } from './conversation/conversation.service';
import { MessagesService } from './message/message.service';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnModuleInit {
   constructor(private conversationService: ConversationService, 
                  private messageService: MessagesService, 
                  private userService : UserService) { } 

  onModuleInit(){
    console.log("AppService Intialized");
  }

   getHello(): string {
    /*
    //Creer User
    try {
      let user = await this.prisma.user.create({
        data:
        {
          firstName: "Ibra",
          name: "Ba",
          mail: "test@test.com",
          password: "password",
          phone: "0101010101",
          username: "ibra" + Date.now()
        }

      })
      console.log("User created with success");

      const payload = {
        event: 'UserProcessed',
        data: {
          username: 'ibra',
          status: 'done',
        },
      };
      //Retourne un message de succès à RabbitMQ 

      await this.rabbitmq.publishToExchange('projet_web', "user-success", payload)
      console.log("Success message sent to queue");
      

    } catch (error) {
      console.log(error);

    }
      */
    return 'Hello !';
  }
}
