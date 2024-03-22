const reset = '\x1b[0m';

function formatMessage(msg: string) {
	const date = new Date();

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	return `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}] ${msg}`;
}

export const logger = {
	success: (msg: string) =>
		console.log('\x1b[32m' + formatMessage(msg) + reset),
	error: (msg: string) =>
		console.log('\x1b[31m' + formatMessage(msg) + reset),
	warning: (msg: string) =>
		console.log('\x1b[33m' + formatMessage(msg) + reset),
	info: (msg: string) => console.log('\x1b[36m' + formatMessage(msg) + reset),
};
