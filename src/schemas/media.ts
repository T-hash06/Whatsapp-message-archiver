import { MongoSingleton } from '@/core/mongo';

const mongoose = MongoSingleton.getInstance();

export interface MediaSchema {
	_id: string;
	mimeType: string;
	data: string;
}

export const mediaSchema = new mongoose.Schema<MediaSchema>({
	_id: String,
	mimeType: String,
	data: String,
});

export const Media = mongoose.model('Media', mediaSchema);
