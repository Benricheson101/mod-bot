import { Client, ClientOptions, Collection, MessageEmbed } from "discord.js";
import { Database } from "./Database";
import { Logger } from "verborum/dist";
import { Config }  from "verborum/dist/utils/interfaces";
import Infraction from "./Infraction";

/**
 * Discord.js client with a few other fancy things
 */
export default class extends Client {
	/** The database */
	db;
	/** The commands collection */
	commands: Collection<string, any>;
	/** The infractions class */
	infractions;

	constructor (options: ClientOptions) {
		super(options);
		if (options.enableDb !== false) this.db = new Database(options.databaseOps);
		this.infractions = new Infraction(this);
	}

	get defaultEmbed (): MessageEmbed {
		return new MessageEmbed()
			.setColor(this.options.defaultColor ?? "#42aaf5");
	}

	/**
	 * Logger
	 * @return {Logger} - The Verborum logger
	 */
	get log (): Logger {
		let ops: Config = this.options.loggerOps;
		let name: string = "logs";
		if (ops.name) name = ops.name;
		let logger: Logger = new Logger(name, ops);
		if (ops.logLevel) logger.level = ops.logLevel;
		if (ops.logFormat) logger.format = ops.logFormat;
		return logger;
	}
}
