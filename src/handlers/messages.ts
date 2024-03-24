import type { Client } from 'whatsapp-web.js';

import { getFormattedDate } from '@/core/logger';
import { logger } from '@/core/logger';
import { Media } from '@/schemas/media';
import { Message } from '@/schemas/message';

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

		let body = message.body ?? '';
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

			media = `${mediaId}.${mediaExtension}`;

			try {
				const newMedia = new Media({
					id: media,
					mimeType: messageMedia.mimetype,
					data: messageMedia.data,
				});

				await newMedia.save();
			} catch (error) {
				logger.error('Error saving media to database');
				console.log(error);
			}
		}

		if (message.type === 'location') {
			body = `${message.location.latitude},${message.location.longitude}`;
		}

		// TODO: Add compatibility for VCards

		const messageData = {
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

		try {
			const newMessage = new Message(messageData);
			await newMessage.save();
		} catch (error) {
			logger.error('Error saving message to database');
			console.log(message);
			console.log(error);
		}

		logger.info(`Message from ${contact} saved`);
	});
};
