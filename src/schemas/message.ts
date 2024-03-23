import * as mongoose from 'mongoose';
// TODO: Import mongoose from Singleton

interface MessageSchema {
	id: string;
	responseTo: string | null;
	media: string | null;
	contact: string;
	body: string;
	type: string;
	from: string;
	to: string;
	time: string;
}

const messageSchema = new mongoose.Schema<MessageSchema>({
	id: { type: String, required: true },
	responseTo: { type: String, required: false },
	media: { type: String, required: false },
	contact: { type: String, required: true },
	body: { type: String, required: false },
	type: { type: String, required: true },
	from: { type: String, required: true },
	to: { type: String, required: true },
	time: { type: String, required: true },
});

export const Message = mongoose.model<MessageSchema>('Message', messageSchema);
