import "discord.js";
import "verborum";
import { Config } from "verborum/dist/utils/interfaces";
import { Level } from "verborum/dist";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import Client from "../classes/Client";
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
		/** The server's configuration */
		config: {
			/** The server's prefix */
			prefix: string;
			/** Should the bot respond to @ mentions */
			mentionPrefix?: boolean;
			/** Should users be DM'd when they receive an infraction */
			infNotify: boolean;
			/** Roles */
			roles: {
				/** Users with these roles have access to moderation commands (ban, kick, warn) */
				moderator?: Snowflake[];
				/** Users with these roles have access to higher-level commands (tbd) */
				admin?: Snowflake[];
			}
		}
		/** Infractions */
		infractions: Infraction[];
		/** Auto incrementing infraction ID number */
		infId: number;
		/** Custom commands */
		commands?: CustomCommand[]
		/** Auto incrementing custom command ID number */
		CCID: number;
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

	/**
	 * Custom commands
	 */
	export interface CustomCommand {
		/** The user who created the command */
		user: Snowflake;
		/** The command name */
		name: string;
		/** The message the command should respond to */
		message: string;
		/** Auto-assigned ID */
		id?: number;
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
		 * Delete an infraction
		 * @param {Snowflake} guild - The guildId
		 * @param {Database.Infraction | number} infraction - The infractionId
		 * @return {object}
		 */
		delete (guild: Snowflake, infraction: number): object;

		/**
		 * Get all of the infractions for a guild.
		 * @param {Snowflake} guild - The guildId
		 * @param {number} infractionId - *Optional* get one infraction
		 * @return {Promise<Database.Infraction>} - The saved infraction
		 */
		getGuild (guild: Snowflake, infractionId?: number): Promise<Database.Infraction | Database.Infraction[] | void>;


		/**
		 * Generate an infraction embed
		 * @param {Message} message - The message object
		 * @param {Database.Infraction} infraction - The infraction
		 * @return {MessageEmbed} - The embed object
		 */
		generateInfEmbed (message: Message, infraction: Database.Infraction): Promise<MessageEmbed>;
	}
}

declare namespace CustomCommand {
	/**
	 * Custom commands
	 */
	export class CustomCommand {
		/**
		 * Discord client
		 * @param {Client} client
		 */
		constructor (client: Client);

		/**
		 * Create a custom command
		 * @param {Snowflake} guild - The ID of the guild where the command will be saved
		 * @param {Database.CustomCommand} command
		 * @return {Promise<Database.CustomCommand>}
		 */
		create (guild: Snowflake, command: Database.CustomCommand): Promise<Database.CustomCommand>;

		/**
		 * Delete a custom command
		 * @param {Snowflake} guild - The guildId
		 * @param {string | number} command - The command to delete (either the command name or ID)
		 * @return {Promise<object>}
		 */
		delete (guild: Snowflake, command?: string | number): Promise<object>;

		/**
		 * Get all of (or a single) guild's custom commands
		 * @param {Snowflake} guild - The guildId
		 * @param {number} [CCID] - The ID of the custom command to return
		 * @return {Promise<Database.CustomCommand[] | Database.CustomCommand>}
		 */
		getGuild (guild: Snowflake, CCID?: number): Promise<Database.CustomCommand[] | Database.CustomCommand>;
	}
}

declare namespace Embed {
	export class Embed {
		static pages (message: Message, content: any[], time?: number, emojis?: PageEmojis, startPage?: number): Promise<any>;
	}

	interface PageEmojis {
		/** Left emoji */
		left: string;
		/** Right emoji */
		right: string;

		end: string;
	}

}
