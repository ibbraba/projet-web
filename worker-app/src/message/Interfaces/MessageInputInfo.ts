interface MessageInputInfo {
  content: string;
  senderId: string;
  conversationId: string;
  sendAt?: Date;  // optional if you want to override default
}

