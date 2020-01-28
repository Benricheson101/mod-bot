import "discord.js";
import "verborum";
import { Config } from "verborum/dist/utils/interfaces";
import { Level } from "verborum/dist";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import Client from "../Client";
import { MongoClientOptions } from "mongodb";

declare module "discord.js" {
	/**
	 * The Discord.js client options
	 */
	export interface ClientOptions {
		/** Logger options */
		loggerOps?: Config;
		/** Enable or disable the MongoDB database */
		enableDb?: boolean;
		/** MongoDB Options */
		databaseOps?: Database.MongoConfig;
		/** Default embed color */
		defaultColor?: string;
		/** The bot owners */
		owners?: Snowflake[];
	}
}

declare module "verborum/dist/utils/interfaces" {
	/**
	 * Verborum options
	 */
	export interface Config {
		/** The name of the logger */
		name?: string;
		/** The log level */
		logLevel?: Level;
		/** The format to use for logs */
		logFormat?: string;
	}
}

declare namespace Command {
	/**
	 * Command file structure
	 */
	export interface ICommand {
		config: {
			/** The name of the command */
			name: string;
			/** Aliases for the command */
			aliases?: string[];
			/** Where the command can be used */
			channelType?: "dm" | "text";
			/** Limit the usage of this command to the bot owner only */
			ownerOnly?: boolean;
			/** Require a preconfigured role use the command */
			role?: "moderator" | "admin";
		},

		/**
		 * The function to run, the actual command code
		 */
		run (client, message, args): Promise<void>;
	}
}

declare namespace Events {
	/**
	 * The message event
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 */
	export function message (client: Client, message: Message, args: string[]): void;
}

declare namespace Database {
	/**
	 * The structure of each guild's database record
	 */
	export interface GuildDB {
		/** The server's ID */
		id: Snowflake;
		/** The server's prefix */
		prefix: string;
		/** Should the bot respond to @ mentions */
		mentionPrefix?: boolean;
		/** Should users be DM'd when they receive an infraction */
		infNotify: boolean;
		/** Infractions */
		infractions: Infraction[];
		/** Auto assigned */
		infId: number;
		/** Roles */
		roles: {
			/** Users with these roles have access to moderation commands (ban, kick, warn) */
			moderator?: Snowflake[];
			/** Users with these roles have access to higher-level commands (tbd) */
			admin?: Snowflake[];
		}
	}

	/**
	 * MongoDB Config
	 */
	export interface MongoConfig {
		/** The MongoDB connection URL */
		url: string;
		/** The database name */
		name: string;
		/** MongoDB client options */
		mongoOptions?: MongoClientOptions;
	}

	/**
	 * Infractions
	 */
	export interface Infraction {
		/** Who added the infraction */
		moderator: Snowflake;
		/** Who received the infraction */
		user: Snowflake;
		/** Why the infraction was added */
		reason?: string;
		/** When the infraction was added */
		date: Date;
		/** Auto assigned infraction id number */
		id?: Number;
		/** What type of infraction */
		type: "warn" | "kick" | "ban";
	}
}

declare namespace Infraction {
	export class Infraction {
		constructor (client: Client);

		/**
		 * Create a new infraction
		 * @param {Snowflake} guild - The guildId
		 * @param {Database.Infraction} infraction - The infraction
		 * @return {Promise<Database.Infraction>} - The saved infraction
		 */
		create (guild: Snowflake, infraction: Database.Infraction): Promise<Database.Infraction>;

		/**
		 * Get all of the infractions for a guild.
		 * @param {Snowflake} guild - The guildId
		 * @param {number} infractionId - *Optional* get one infraction
		 * @return {Promise<Database.Infraction>} - The saved infraction
		 */
		getGuild (guild: Snowflake, infractionId?: number): Promise<Database.Infraction | Database.Infraction[] | void>;

		/**
		 * Delete an infraction
		 * @param {Snowflake} guild - The guildId
		 * @param {Database.Infraction | number} infraction - The infractionId
		 * @return {Object}
		 */
		delete (guild: Snowflake, infraction: number): Object;

		/**
		 * Generate an infraction embed
		 * @param {Message} message - The message object
		 * @param {Database.Infraction} infraction - The infraction
		 * @return {MessageEmbed} - The embed object
		 */
		generateInfEmbed (message: Message, infraction: Database.Infraction): Promise<MessageEmbed>;
	}
}
