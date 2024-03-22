import * as qrcode from 'qrcode-terminal';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';

import { createMongoose } from './mongo';

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
				}),
				qrMaxRetries: 10,
			});

			this.instance = client;
		}

		return ClientSingleton.instance;
	}
}

export const createClient = () => ClientSingleton.getInstance();

export async function initialize() {
	const client = await ClientSingleton.getInstance();

	return new Promise<null>((resolve) => {
		client.on('qr', (qr) => {
			console.clear();
			qrcode.generate(qr, { small: true });
		});

		client.on('authenticated', () => {
			console.log('Authenticated');
		});

		client.on('ready', () => {
			console.log('Client is ready');
			resolve(null);
		});

		client.initialize();
	});
}
