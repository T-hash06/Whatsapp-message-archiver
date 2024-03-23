import { MongoSingleton } from '@/mongo';

const mongoose = MongoSingleton.getInstance();

interface MessageSchema {
	id: string;
	mimeType: string;
	data: string;
}

const mediaSchema = new mongoose.Schema<MessageSchema>({
	id: String,
	mimeType: String,
	data: String,
});

export const Media = mongoose.model('Media', mediaSchema);
