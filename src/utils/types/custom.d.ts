import "discord.js";
import "verborum";
import { IConfig } from "verborum/dist/interfaces";
import { Level } from "verborum/dist";
import { Message, Snowflake } from "discord.js";
import Client from "../Client";
import { MongoClientOptions } from "mongodb";

declare module "discord.js" {
	/**
	 * The Discord.js client options
	 */
	export interface ClientOptions {
		/** The (default) prefix the bot will respond to */
		prefix?: string[] | string;
		/** Allow the bot to respond when it is mentioned */
		mentionPrefix?: boolean;
		/** Logger options */
		loggerOps?: IConfig;
	}
}

declare module "verborum/dist/interfaces" {
	/**
	 * Verborum options
	 */
	export interface IConfig {
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
			/**
			 * [R] The name of the command
			 */
			name: string;
			/**
			 * [O] Aliases for the command
			 */
			aliases?: string[];
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
	 * The structure of each guild's settings
	 */
	export interface GuildOps {
		/** The server's ID */
		id: Snowflake;
		/** The server's prefix */
		prefix: string;
		/** Should users be DM'd when they receive an infraction */
		infNotify: boolean;
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

}
