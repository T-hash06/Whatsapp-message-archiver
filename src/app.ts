import 'dotenv/config';

import { createClient, initialize } from '@/client';
import { logger } from '@/logger';
import { createMongoose } from '@/mongo';

async function main() {
	console.clear();

	logger.info('Starting app...');

	await createMongoose();
	await createClient();

	await initialize();
}

main().then(() => {
	console.log('App finished');
});
