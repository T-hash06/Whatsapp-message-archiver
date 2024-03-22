import 'dotenv/config';

import { createClient, initialize } from './client';
import { createMongoose } from './mongo';

async function main() {
	await createMongoose();
	await createClient();

	console.clear();

	await initialize();
}

main().then(() => {
	console.log('App finished');
});
