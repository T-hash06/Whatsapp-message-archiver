console.clear();

import '@/core/config';

import { ClientSingleton } from '@/core/client';
import { logger } from '@/core/logger';
import { MongoSingleton } from '@/core/mongo';

async function main() {
	logger.ghost('Starting app...');

	await MongoSingleton.connect();
	await ClientSingleton.initialize();
}

main().then(() => {
	logger.ghost('App finished');
});
