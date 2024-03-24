const reset = '\x1b[0m';

export function addIndentation(text: string) {
	// Add indentation to the text on new lines
	return text.replace(/\n/g, '\n\t\t      ');
}

export function formatNumber(num: number) {
	return num < 10 ? `0${num}` : num;
}

export function getFormattedDate() {
	const date = new Date();

	const hours = formatNumber(date.getHours());
	const minutes = formatNumber(date.getMinutes());
	const seconds = formatNumber(date.getSeconds());

	const day = formatNumber(date.getDate());
	const month = formatNumber(date.getMonth());
	const year = date.getFullYear();

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatMessage(msg: string) {
	return `[${getFormattedDate()}] ${addIndentation(msg)}`;
}

export const logger = {
	history: [] as string[],

	success: (msg: string) => {
		const log = '\x1b[32m' + formatMessage(msg) + reset;
		logger.history.push(log);
		console.log(log);
	},
	error: (msg: string) => {
		const log = '\x1b[31m' + formatMessage(msg) + reset;
		logger.history.push(log);
		console.log(log);
	},
	warning: (msg: string) => {
		const log = '\x1b[33m' + formatMessage(msg) + reset;
		logger.history.push(log);
		console.log(log);
	},
	ghost: (msg: string) => {
		const log = '\x1b[2m\x1b[37m' + formatMessage(msg) + reset;
		logger.history.push(log);
		console.log(log);
	},
	info: (msg: string) => {
		const log = '\x1b[36m' + formatMessage(msg) + reset;
		logger.history.push(log);
		console.log(log);
	},
	printHistory: () => {
		logger.history.forEach((log) => console.log(log));
	},
};
