import 'dotenv/config';

import { createClient, initialize } from './client';
import { createMongoose } from './mongo';

async function main() {
	console.clear();

	console.log('Starting app...');

	await createMongoose();
	await createClient();

	await initialize();
}

main().then(() => {
	console.log('App finished');
});
