import mongooseDefault from 'mongoose';

import { Config } from '@/core/config';
import { logger } from '@/core/logger';

export class MongoSingleton {
	private static instance: typeof mongooseDefault;
	private static connected = false;

	private constructor() {}

	public static getInstance(): typeof mongooseDefault {
		if (!this.connected) {
			logger.warning('Using MongoDB without connecting first');
		}

		if (!MongoSingleton.instance) {
			MongoSingleton.instance = mongooseDefault;
		}

		return MongoSingleton.instance;
	}

	public static async connect() {
		logger.ghost('Connecting to MongoDB...');

		await mongooseDefault.connect(Config.MONGO_URI);

		this.connected = true;

		logger.success('Connected to MongoDB');
	}
}
