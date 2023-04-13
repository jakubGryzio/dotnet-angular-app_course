export interface Message {
  id: number;
  senderId: number;
  senderUsername: string;
  senderPhtotUrl: string;
  recipientId: number;
  recipientUsername: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
}
