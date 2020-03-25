import "discord.js";
import "verborum";
import { Config } from "verborum/dist/utils/interfaces";
import { Level } from "verborum/dist";
import { Guild, Message, MessageEmbed, PermissionString, Snowflake, User } from "discord.js";
import Client from "@classes/Client";
import { MongoClientOptions } from "mongodb";
import { RequestInit, Response } from "node-fetch";
import { NodeOptions } from "@sentry/node";

//todo: make this less messy

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
    databases?: Database.MongoConfig[];
    /** Default embed color */
    defaultColor?: string;
    /** The bot owners */
    owners?: Snowflake[];
    /** Should the bot respond to mentions */
    mentionPrefix?: boolean;
    /** Sentry error tracking settings */
    sentry?: {
      /** Enable or disable Sentry */
      enabled?: boolean;
      /** Sentry DSN */
      sentryOps?: NodeOptions
    }
  }

  /** Guild structure */
  export interface Guild {
    /** The database */
    db: Promise<Database.GuildDB>;
  }

  /** GuildMember structure */
  export interface GuildMember {
    /** The GuildMember's database record */
    db: Promise<Database.User>;
  }

  /** User structure */
  export interface User {
    /** The user's database record */
    db: Promise<Database.User>;
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
    levels?: Level[];
    /** The format to use for logs */
    format?: string;
  }
}

declare namespace Command {
  /**
   * Command file structure
   */
  export interface Command {
    config: CommandOptions;

    /**
     * The function to run, the actual command code
     */
    run (client?: Client, message?, args?: string[]): Promise<void>;
  }

  /** Options for each command */
  export interface CommandOptions {
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
    /** Enable or disable the command */
    disabled?: boolean;
    /** Stuff for the help command */
    help: {
      /** What the command does */
      description?: string;
      /** Command syntax */
      usage?: string;
      /** Example usage */
      example?: string;
      /** Permissions required to use the command */
      permissions?: PermissionString[];
      /** Should the command be hidden from the help command/command list */
      hidden?: boolean;
      /** Which category the command falls into */
      category: "info"
        | "picture"
        | "animal"
        | "other"
        | "admin"
        | "moderation"
        | "custom-commands"
        | "fun"
        | "poll"
        | "support"
        | string;
    }
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
      // /** Should the bot respond to @ mentions */
      //mentionPrefix?: boolean;
      /** Should users be DM'd when they receive an infraction */
      infNotify: boolean;
      /** Roles */
      roles: {
        /** Users with these roles have access to moderation commands (ban, kick, warn) */
        moderator?: Snowflake[];
        /** Users with these roles have access to higher-level commands (tbd) */
        admin?: Snowflake[];
      }
      enabledLogs: Logs[];
      /** Starboard options */
      starboard: {
        /** Enable/disable the starboard */
        enabled: boolean;
        /** Which channel to post messages in */
        channel?: Snowflake;
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
    /** Starred messages */
    starboardMessages: Starboard[];
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

  /** User/GuildMember */
  export interface User {
    /** The user's custom acknowledgement */
    acknowledgement?: string;
  }

  /** Logs */
  export interface Logs {
    event: string;
    channel: Snowflake;
  }

  /** Starboard */
  export interface Starboard {
    /** The message id */
    message: Snowflake;
    /** The message content */
    content: string;
  }
}

declare namespace Infraction {
  export class Infraction {
    constructor (client: Client);

    /**
     * Create a new infraction
     * @param {Guild} guild - The guildId
     * @param {User} user - The user that the infraction is being added to
     * @param {Database.Infraction} infraction - The infraction
     * @return {Promise<Database.Infraction>} - The saved infraction
     */
    create (guild: Guild, user: User, infraction: Database.Infraction): Promise<Database.Infraction>;

    /**
     * Delete an infraction
     * @param {Guild} guild - The guildId
     * @param {Database.Infraction | number} infraction - The infractionId
     * @return {object}
     */
    delete (guild: Guild, infraction: number): object;

    /**
     * Get all of the infractions for a guild.
     * @param {Snowflake} guild - The guildId
     * @param {number} infractionId - *Optional* get one infraction
     * @return {Promise<Database.Infraction>} - The saved infraction
     */
    getGuild (guild: Snowflake, infractionId?: number): Promise<Database.Infraction | Database.Infraction[] | void>;


    /**
     * Generate an infraction embed
     * @param {Database.Infraction} infraction - The infraction
     * @return {MessageEmbed} - The embed object
     */
    generateInfEmbed (infraction: Database.Infraction): Promise<MessageEmbed>;

    update (guild, infraction, changes): object;
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
    /**
     * Send a paginated message
     * @param {Message} message - The message object
     * @param {string[] | MessageEmbed[]} content - What each page should be
     * @param {number} [time] - How long the pagination should be active
     * @param {E.PageEmojis} [emojis] - What emojis to add to the message. Reacts in the order of the keys in the object
     * @param {E.PageEmojis.left} emojis.left="⬅" - The emoji to display the previous page
     * @param {E.PageEmojis.right} emojis.right="➡" - The emoji to display the next page
     * @param {E.PageEmojis.end} emojis.end="⏹" - The emoji that will delete the message
     * @param {number} [startPage=0] - Which page to start on
     * @returns {Promise<void>}
     */
    static pages (message: Message, content: any[], time?: number, emojis?: PageEmojis, startPage?: number): Promise<any>;
  }

  export interface PageEmojis {
    /** Left emoji */
    left: string;
    /** Right emoji */
    right: string;
    /** End emoji */
    end: string;
  }

}

declare namespace Util {
  export class Util {
    /**
     * Generate a confirmation message
     * @param {Message} message - The message object
     * @param {string} confirmationMsg - What the user is confirming
     * @param {Util.ConfirmationOptions} [options] - Options
     * @param {number} [options.time] - How long the function should wait for a response
     * @param {"accept" | "deny"} [options.timeEndAction] - What should happen when time runs out
     * @returns {Promise<boolean>}
     */
    static confirmation (message: Message, confirmationMsg: string, options?: ConfirmationOptions): Promise<boolean>;
  }

  export interface ConfirmationOptions {
    time?: number;
    timeEndAction?: "accept" | "deny"
  }
}

/** Make a request to an API */
export class Request {

  /**
   * Make a request to the [Chewey-Bot API](https://api.chewey-bot.top/)
   * @param  {string} path - The endpoint to make a request to
   */
  chewey (path: string): Promise<any>;

  /**
   * Make a request to https://blue.catbus.co.uk/
   * @param  {string} path - The endpoint to make a request to
   */
  betterE6 (path: string): Promise<any>;

  /**
   * Make a request to the [NASA API](https://api.chewey-bot.top/)
   * @param  {string} path - The endpoint to make a request to
   */
  nasa (path: string): Promise<any>;

  /**
   * Make a request
   * @param {string} url - Where to make the request
   * @param {RequestInit} ops - Request options
   * @returns {Promise<Response>}
   * @private
   */
  _makeRequest (url: string, ops?: RequestInit): Promise<Response>
}

