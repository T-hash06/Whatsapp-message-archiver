import type { Client } from 'whatsapp-web.js';

import { getFormattedDate } from '../logger';
import { logger } from '../logger';

interface MessageSchema {
	id: string;
	responseTo: string | null;
	media: string | null;
	contact: string;
	body: string;
	type: string;
	from: string;
	to: string;
	time: string;
}

function getPhoneNumber(phone: string) {
	return phone.split('@')[0];
}

export const addMessageHandler = (client: Client) => {
	client.on('message', async (message) => {
		if (message.fromMe) return;

		const contactInfo = await message.getContact();

		const time = getFormattedDate();
		const from = getPhoneNumber(message.from);
		const to = getPhoneNumber(message.to);
		const id = message.id.id;
		const contact = contactInfo.name ?? contactInfo.pushname;

		const type = message.type;

		let body = message.body;
		let responseTo = null;
		let media = null;

		if (message.hasQuotedMsg) {
			const quotedMsg = await message.getQuotedMessage();
			responseTo = quotedMsg.id.id;
		}

		if (message.hasMedia) {
			const messageMedia = await message.downloadMedia();
			const mediaId = message.id.id;
			const mediaExtension = messageMedia.mimetype
				.split('/')[1]
				.split(';')[0];

			media = `./media/${mediaId}.${mediaExtension}`;

			// TODO: Save media to database
		}

		if (message.type === 'location') {
			body = `${message.location.latitude},${message.location.longitude}`;
		}

		// TODO: Add compatibility for VCards

		const messageData: MessageSchema = {
			id,
			responseTo,
			media,
			contact,
			body,
			type,
			from,
			to,
			time,
		};

		logger.info(`\n${JSON.stringify(messageData, null, 4)}`);
	});
};
