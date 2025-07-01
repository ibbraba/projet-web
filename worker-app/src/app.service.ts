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
}
