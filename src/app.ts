import 'dotenv/config';

async function main() {
	console.log(process.env.TEST);
}

main().then(() => {
	console.log('done');
});
