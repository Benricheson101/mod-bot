import {
	connect,
	Collection,
	UpdateOneOptions,
	FindAndModifyWriteOpResultObject,
	UpdateWriteOpResult,
	InsertOneWriteOpResult, CollectionInsertOneOptions
} from "mongodb";
import { Database as D } from "@types";

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

	async insert (collection: string, data: any, options?: CollectionInsertOneOptions): Promise<InsertOneWriteOpResult<any>> {
		return this.db.collection(collection).insertOne(data, options);
	}

	async update (collection: string, query: any, data: any, options?: UpdateOneOptions): Promise<UpdateWriteOpResult> {
		return this.db.collection(collection).updateOne(query, data, options);
	}

	async findOne (collection: string, query: any) {
		return this.db.collection(collection).findOne(query);
	}
}
