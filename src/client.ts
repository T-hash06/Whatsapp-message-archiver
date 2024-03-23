import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';

import { addBasicHandlers } from '@/handlers/basics';
import { addMessageHandler } from '@/handlers/messages';
import { createMongoose } from '@/mongo';

export class ClientSingleton {
	private static instance: Client;

	private constructor() {}

	public static async getInstance(): Promise<Client> {
		const mongoose = await createMongoose();

		if (!ClientSingleton.instance) {
			const store = new MongoStore({ mongoose: mongoose });

			const client = new Client({
				authStrategy: new RemoteAuth({
					store: store,
					backupSyncIntervalMs: 36_000_000,
					clientId: 'T-Hash06',
				}),
			});

			this.instance = client;
		}

		return ClientSingleton.instance;
	}
}

export const createClient = () => ClientSingleton.getInstance();

export async function initialize() {
	const client = await ClientSingleton.getInstance();

	addBasicHandlers(client);
	addMessageHandler(client);

	return new Promise<void>(() => {
		client.initialize();
	});
}
