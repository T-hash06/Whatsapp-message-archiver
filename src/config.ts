import 'dotenv/config';

import { logger } from '@/logger';

export class ConfigSingleton {
	private static instance: ConfigSingleton;

	public readonly MONGO_URI: string;
	public readonly SAVE_ALL_MESSAGES: boolean = false;
	public readonly PRINT_CONFIG = process.env.PRINT_CONFIG === 'true';
	public readonly SAVE_MESSAGES_FROM: string[];

	private constructor() {
		logger.ghost('Loading configuration...');

		this.MONGO_URI =
			process.env.MONGO_URI || 'mongodb://localhost:27017/test';

		this.SAVE_MESSAGES_FROM = process.env.SAVE_MESSAGES_FROM
			? process.env.SAVE_MESSAGES_FROM.replace(/\s/g, '').split(',')
			: [];

		this.SAVE_ALL_MESSAGES = process.env.SAVE_ALL_MESSAGES === 'true';
		this.PRINT_CONFIG = process.env.PRINT_CONFIG === 'true';

		if (this.SAVE_ALL_MESSAGES && this.SAVE_MESSAGES_FROM.length > 0) {
			logger.warning(
				'Both SAVE_ALL_MESSAGES and SAVE_MESSAGES_FROM are set. SAVE_MESSAGES_FROM will be ignored.'
			);
		}

		if (this.SAVE_MESSAGES_FROM.length === 0 && !this.SAVE_ALL_MESSAGES) {
			logger.warning(
				'Both SAVE_ALL_MESSAGES and SAVE_MESSAGES_FROM are not set. No messages will be saved.'
			);
		}

		logger.ghost('Configuration loaded');

		if (this.PRINT_CONFIG) {
			logger.info(
				`Current configuration: \n${JSON.stringify(this, null, 4)}`
			);
		}
	}

	public static getInstance(): ConfigSingleton {
		if (!ConfigSingleton.instance) {
			ConfigSingleton.instance = new ConfigSingleton();
		}

		return ConfigSingleton.instance;
	}
}

export const Config = ConfigSingleton.getInstance();
