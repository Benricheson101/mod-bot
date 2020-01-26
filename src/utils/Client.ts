import { Client, ClientOptions, Collection } from "discord.js";
import { Database } from "./Database";
import { Logger } from "verborum/dist";
import { IConfig } from "verborum/dist/interfaces";

/**
 * Discord.js client with a few other fancy things
 */
export default class extends Client {
	/** The MongoDB Database */
	db;
	/** The commands collection */
	commands: Collection<string, any>;
	events: Collection<string, any>;

	constructor (options: ClientOptions) {
		super(options);
		this.db = new Database({
			url: process.env.MONGO,
			name: "mod-bot",
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		});
	}

	/**
	 * Logger
	 * @return {Logger} - The Verborum logger
	 */
	get log (): Logger {
		let ops: IConfig = this.options.loggerOps;
		let name: string = "logs";
		if (ops.name) name = ops.name;
		let logger: Logger = new Logger(name, ops);
		if (ops.logLevel) logger.level = ops.logLevel;
		if (ops.logFormat) logger.format = ops.logFormat;
		return logger;
	}
}
