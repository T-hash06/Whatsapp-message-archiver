import {
	type Chat as WChat,
	type Client as WClient,
	type Message as WMessage,
	MessageTypes,
} from 'whatsapp-web.js';

import { Config } from '@/core/config';
import { getFormattedDateString } from '@/core/logger';
import { logger } from '@/core/logger';
import { Chat } from '@/schemas/chat';
import { Media } from '@/schemas/media';
import { Message } from '@/schemas/message';

function getPhoneNumber(phone: string) {
	return phone.split('@')[0];
}

function mustBeSaved(message: WMessage, chat: WChat) {
	return (
		Config.SAVE_ALL_MESSAGES ||
		Config.SAVE_MESSAGES_FROM.some((register) => {
			const normalized = register.toLowerCase();
			return (
				normalized === chat.name.toLowerCase() ||
				normalized === chat.id._serialized ||
				normalized === chat.id.user ||
				normalized === getPhoneNumber(message.from) ||
				normalized === getPhoneNumber(message.to)
			);
		})
	);
}

async function messageHandler(message: WMessage) {
	const chat = await message.getChat();

	const contactInfo = await message.getContact();

	const formattedDate = getFormattedDateString();
	const date = new Date(message.timestamp);
	const from = getPhoneNumber(message.from);
	const to = getPhoneNumber(message.to);
	const fromMe = message.fromMe;
	const contact = contactInfo.name ?? contactInfo.pushname;
	const _id = message.id.id;

	const type = message.type;
	const target = fromMe ? `to ${chat.name}` : `from ${contact}`;

	let dbChat = await Chat.findOne({ _id: chat.id._serialized });
	let body = message.body ?? '';
	let responseTo = null;
	let media = null;

	if (!mustBeSaved(message, chat)) {
		logger.ghost(`Message ${target} will be ignored`);
		return;
	}

	if (message.hasQuotedMsg) {
		const quotedMsg = await message.getQuotedMessage();
		responseTo = quotedMsg.id.id;
	}

	if (message.isStatus) {
		logger.ghost(`Status ${target}, status will be ignored`);
		// TODO: Save status to database
		return;
	}

	if (message.hasMedia) {
		const messageMedia = await message.downloadMedia();
		const mediaId = message.id.id;
		const mediaExtension = messageMedia.mimetype
			.split('/')[1]
			.split(';')[0];

		media = new Media({
			_id: `${mediaId}.${mediaExtension}`,
			mimeType: messageMedia.mimetype,
			data: messageMedia.data,
		});

		try {
			await media.save();
		} catch (error) {
			logger.error('Error saving media to database');
			console.log(error);
		}
	}

	if (message.type === MessageTypes.LOCATION) {
		body = `${message.location.latitude},${message.location.longitude}`;
	}

	// TODO: Add compatibility for VCards

	const messageData = {
		_id,
		responseTo,
		contact,
		body,
		type,
		fromMe,
		from,
		to,
		date,
		formattedDate,
		media: media ? media._id : null,
	};

	const newMessage = new Message(messageData);

	if (!dbChat) {
		//TODO: Extract this to a method
		try {
			dbChat = new Chat({
				_id: chat.id._serialized,
				name: chat.name,
				isGroup: chat.isGroup,
			});

			logger.success(`Chat ${chat.name} created`);
		} catch (error) {
			logger.error('Error saving chat to database');
			console.log(error);

			return;
		}
	}

	try {
		dbChat.messages.push(newMessage);
		await dbChat.save();

		logger.info(`Message ${target} saved`);
	} catch (error) {
		logger.error('Error saving message to chat');
		console.log(error);
	}
}

export const addMessageHandler = (client: WClient) => {
	client.on('message_create', async (message) => {
		messageHandler(message);
	});
};
