console.clear();

import '@/config';

import { ClientSingleton } from '@/client';
import { logger } from '@/logger';
import { MongoSingleton } from '@/mongo';

async function main() {
	logger.ghost('Starting app...');

	await MongoSingleton.connect();
	await ClientSingleton.initialize();
}

main().then(() => {
	logger.ghost('App finished');
});
