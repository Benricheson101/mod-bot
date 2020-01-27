import { connect, Collection } from "mongodb";
import { Database as D } from "../utils/types/custom";

export class Database {
	db;

	constructor (private config: D.MongoConfig) {
	}

	/**
	 * Connect to the database
	 * @return {Promise<void>}
	 */
	async connect (): Promise<void> {
		const mongo = await connect(this.config.url, this.config.mongoOptions)
			.catch((err) => {
				throw err;
			});
		this.db = mongo.db(this.config.name);
	}

	/**
	 * Get the saved guilds
	 * @example
	 * Client.db.guilds.findOne({ id: 123 })
	 * @returns {Collection<GuildDB>} - The guild's settings document
	 */
	get guilds (): Collection<D.GuildDB> {
		return this.db.collection("guilds");
	}

	/**
	 * Get the saved users
	 * @return {Collection}
	 */
	get users (): Collection {
		return this.db.collection("users");
	}
}
