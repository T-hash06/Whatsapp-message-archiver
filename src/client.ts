import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';

import { addBasicHandlers } from '@/handlers/basics';
import { addMessageHandler } from '@/handlers/messages';
import { MongoSingleton } from '@/mongo';

export class ClientSingleton {
	private static instance: Client;

	private constructor() {}

	public static getInstance(): Client {
		const mongoose = MongoSingleton.getInstance();

		if (!ClientSingleton.instance) {
			const store = new MongoStore({ mongoose: mongoose });

			const client = new Client({
				authStrategy: new RemoteAuth({
					store: store,
					backupSyncIntervalMs: 36_000_000,
					clientId: process.env.CLIENT_ID ?? 'THash06', // TODO: Extract to config
				}),
			});

			this.instance = client;
		}

		return ClientSingleton.instance;
	}

	public static async initialize() {
		const client = ClientSingleton.getInstance();

		addBasicHandlers(client);
		addMessageHandler(client);

		return new Promise<void>(() => {
			client.initialize();
		});
	}
}
