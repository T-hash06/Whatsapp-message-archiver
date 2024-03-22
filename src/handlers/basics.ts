import * as qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';

export const addBasicHandlers = (client: Client) => {
	let qrReceived = false;

	client.on('qr', (qr) => {
		console.clear();
		qrcode.generate(qr, { small: true });
		qrReceived = true;
	});

	client.on('remote_session_saved', () => {
		console.log('Remote session saved');
	});

	client.on('auth_failure', (msg) => {
		console.log('Authentication failure: ', msg);
	});

	client.on('authenticated', () => {
		console.clear();

		if (qrReceived) {
			console.log(
				'Authenticated, please wait until the remote session is saved'
			);
			return;
		}

		console.log('Authenticated with stored session');
	});

	client.on('ready', () => {
		console.log('Client is ready');
	});
};
