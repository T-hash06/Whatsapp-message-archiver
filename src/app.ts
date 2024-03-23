import 'dotenv/config';

import { ClientSingleton } from '@/client';
import { logger } from '@/logger';
import { MongoSingleton } from '@/mongo';

async function main() {
	console.clear();

	logger.ghost('Starting app...');

	await MongoSingleton.connect();
	await ClientSingleton.initialize();
}

main().then(() => {
	console.log('App finished');
});
