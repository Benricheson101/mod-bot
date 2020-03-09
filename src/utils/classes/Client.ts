import {
	Client,
	ClientOptions,
	Collection,
	MessageEmbed,
	Snowflake,
	User
} from "discord.js";
import { Database } from "./Database";
import { Logger } from "verborum/dist";
import { Config } from "verborum/dist/utils/interfaces";
import Infraction from "./Infraction";
import * as Sentry from "@sentry/node";
import StatsTracker from "@classes/StatsTracker";

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
	/** Stats tracker */
	tracker;
	/** Cooldowns */
	cooldowns: Collection<string, number>;
	/** Disabled commands */
	disabled: Collection<string, any>;

	constructor (options: ClientOptions) {
		super(options);
		this.db = new Database(options.databases[0]);
		this.infractions = new Infraction(this);
		this.tracker = new StatsTracker(options.databases[1]);
		if (options.sentry && options.sentry.enabled) {
			this.log.debug("Using Sentry");
			Sentry.init(options.sentry.sentryOps);
		}
	}

	/**
	 * A "default embed", one with just the color set to the default color
	 * @return {MessageEmbed}
	 */
	get defaultEmbed (): MessageEmbed {
		return new MessageEmbed()
			.setColor(this.options.defaultColor ?? "#42aaf5");
	}

	/**
	 * Get a user
	 * @param {Snowflake} user
	 * @return {Promise<User>}
	 */
	async getUser (user: Snowflake): Promise<User> {
		return this.users.cache.find((u) => u.id === user)
			|| await this.users.fetch(user)
			|| null;
	}

	/**
	 * Logger
	 * @return {Logger} - The Verborum logger
	 */
	get log (): Logger {
		let ops: Config = this.options.loggerOps;
		let name: string = "logs";
		if (ops.name) name = ops.name;
		return new Logger(name, ops);
	}
}
