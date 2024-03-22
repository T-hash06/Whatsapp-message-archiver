const reset = '\x1b[0m';

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
	return `[${getFormattedDate()}] ${msg}`;
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
