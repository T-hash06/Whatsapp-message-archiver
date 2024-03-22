import type { Client } from 'whatsapp-web.js';

export const addMessageHandler = (client: Client) => {
	client.on('message', async (message) => {
		if (message.body === 'ping') {
			message.reply('pong');
		}
	});
};
