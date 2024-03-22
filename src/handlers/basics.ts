import * as qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';

import { logger } from '../logger';

export const addBasicHandlers = (client: Client) => {
	let qrReceived = false;

	client.on('qr', (qr) => {
		console.clear();
		qrcode.generate(qr, { small: true });
		qrReceived = true;
	});

	client.on('remote_session_saved', () => {
		logger.success('Remote session saved');
	});

	client.on('auth_failure', (msg) => {
		logger.error(`Authentication failure: ${msg}`);
	});

	client.on('authenticated', () => {
		if (qrReceived) {
			logger.success(
				'Authenticated, please wait until the remote session is saved'
			);
			console.clear();
			return;
		}

		logger.success('Authenticated with stored session');
	});

	client.on('ready', () => {
		logger.info('Client is ready');
	});
};
