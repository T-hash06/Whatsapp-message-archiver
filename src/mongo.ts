import mongooseDefault from 'mongoose';

export class MongoSingleton {
	private static instance: typeof mongooseDefault;
	private static connected = false;

	private constructor() {}

	public static async getInstance(): Promise<typeof mongooseDefault> {
		if (!this.connected) {
			await this.connect();
		}

		if (!MongoSingleton.instance) {
			MongoSingleton.instance = mongooseDefault;
		}

		return MongoSingleton.instance;
	}

	private static async connect() {
		if (!process.env.MONGO_URI) {
			throw new Error('MONGO_URI is not defined');
		}

		await mongooseDefault.connect(process.env.MONGO_URI);

		this.connected = true;
	}
}

export const createMongoose = () => MongoSingleton.getInstance();
