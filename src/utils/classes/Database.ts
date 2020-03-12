import {
	connect,
	Collection,
	UpdateOneOptions,
	UpdateWriteOpResult,
	InsertOneWriteOpResult,
	CollectionInsertOneOptions,
	DeleteWriteOpResultObject,
	ReplaceOneOptions,
	ReplaceWriteOpResult,
	ClientSession, MongoCountPreferences
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

	//todo: Pull operator?

	/**
	 * Insert a document
	 * @param {string} collection
	 * @param data
	 * @param {CollectionInsertOneOptions} options
	 * @returns {Promise<InsertOneWriteOpResult<any>>}
	 */
	async insert (collection: CollectionName, data: any, options?: CollectionInsertOneOptions): Promise<InsertOneWriteOpResult<any>> {
		return this.db.collection(collection).insertOne(data, options);
	}

	/**
	 * Update a document
	 * @param {string} collection
	 * @param query
	 * @param data
	 * @param {UpdateOneOptions} options
	 * @returns {Promise<UpdateWriteOpResult>}
	 */
	async update (collection: CollectionName, query: any, data: any, options?: UpdateOneOptions): Promise<UpdateWriteOpResult> {
		return this.db.collection(collection).updateOne(query, { $set: data }, options);
	}

	/**
	 * Update a document *Note: must include operators!*
	 * @param {CollectionName} collection
	 * @param query
	 * @param data
	 * @param {UpdateOneOptions} options
	 * @returns {Promise<UpdateWriteOpResult>}
	 * @example
	 * updateRaw("guilds", { id: "1234" }, { $set: { prefix: "!!" } })
	 */
	async updateRaw (collection: CollectionName, query: any, data: any, options?: UpdateOneOptions): Promise<UpdateWriteOpResult> {
		return this.db.collection(collection).updateOne(query, data, options);
	}

	/**
	 * Replace a document
	 * @param {string} collection
	 * @param filter
	 * @param data
	 * @param {ReplaceOneOptions} options
	 * @returns {Promise<ReplaceWriteOpResult>}
	 */
	async replace (collection: CollectionName, filter: any, data: any, options?: ReplaceOneOptions): Promise<ReplaceWriteOpResult> {
		return this.db.collection(collection).replaceOne(filter, data, options);
	}

	/**
	 * Delete a document
	 * @param {string} collection
	 * @param query
	 * @returns {Promise<DeleteWriteOpResultObject>}
	 */
	async delete (collection: CollectionName, query: any): Promise<DeleteWriteOpResultObject> {
		return this.db.collection(collection).deleteOne(query);
	}

	/**
	 * Drop a collection
	 * @param {CollectionName} collection
	 * @param {ClientSession} options
	 * @returns {Promise<boolean>}
	 */
	async drop (collection: CollectionName, options?: ClientSession): Promise<boolean> {
		return this.db.collection(collection).drop((options as any));
	}

	/**
	 * Find a document
	 * @param {string} collection
	 * @param query
	 * @returns {Promise<any | null>}
	 */
	async find (collection: CollectionName, query: any): Promise<any | null> {
		return this.db.collection(collection).findOne(query);
	}

	/**
	 * Count the number of documents in a collection
	 * @param collection
	 * @param query
	 * @param options
	 * @returns {Promise<number>}
	 */
	async count (collection: CollectionName, query?: any, options?: MongoCountPreferences): Promise<number> {
		return this.db.collection(collection).countDocuments(query, options);
	}

	async findMany (collection: CollectionName, query: any): Promise<any[]> {
		return this.db.collection(collection).find(query).toArray();
	}

	// Discord.js specific methods

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

type CollectionName = "users" | "guilds" | string;
