import { MongoSingleton } from '@/core/mongo';

const mongoose = MongoSingleton.getInstance();

export interface MessageSchema {
	_id: string;
	responseTo: string | null;
	contact: string;
	body: string;
	type: string;
	fromMe: boolean;
	from: string;
	to: string;
	date: Date;
	formattedDate: string;
	media: string | null;
}

export const messageSchema = new mongoose.Schema<MessageSchema>(
	{
		_id: { type: String, required: true },
		responseTo: { type: String, required: false },
		contact: { type: String, required: true },
		body: { type: String, required: false },
		type: { type: String, required: true },
		fromMe: { type: Boolean, required: true },
		from: { type: String, required: true },
		to: { type: String, required: true },
		date: { type: Date, required: true },
		formattedDate: { type: String, required: true },
		media: { type: String, ref: 'Media', required: false },
	},
	{
		autoCreate: false,
		autoIndex: false,
	}
);

export const Message = mongoose.model<MessageSchema>('Message', messageSchema);
