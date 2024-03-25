import { MongoSingleton } from '@/core/mongo';
import { type MessageSchema, messageSchema } from '@/schemas/message';

const mongoose = MongoSingleton.getInstance();

export interface ChatSchema {
	_id: string;
	name: string;
	isGroup: boolean;
	messages: [MessageSchema];
}

export const chatSchema = new mongoose.Schema<ChatSchema>({
	_id: { type: String, required: true },
	name: { type: String, required: true },
	isGroup: { type: Boolean, required: true },
	messages: [messageSchema],
});

export const Chat = mongoose.model<ChatSchema>('Chat', chatSchema);
