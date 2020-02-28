import { ClientOptions, Message, PermissionString, Snowflake } from "discord.js";
import { Database as D, Command as C } from "@types";

export const admins = [
	"255834596766253057"
];

export const defaults = {
	prefix: "otter:"
};

export const defaultGuild = (guildId: Snowflake): D.GuildDB => {
	return {
		id: guildId,
		config: {
			prefix: defaults.prefix,
			infNotify: true,
			roles: {},
			enabledLogs: [],
			starboard: {
				enabled: false
			}
		},
		infractions: [],
		infId: 0,
		commands: [],
		CCID: 0,
		starboardMessages: []
	};
};

export const errors = {
	generic: ":x: An error occurred. Please try again.",
	usage: ":x: Incorrect usage.",
	userPerms (permissions: PermissionString[]): string {
		return `:x: You do not have permission to use this command. You must have \`${permissions}\``;
	},
	botPerms (permissions: PermissionString[]): string {
		return `:x: I was not able to execute this command because I am missing the following permission${permissions.length === 1 ? "" : "s"}: \`${permissions}\``;
	},
	async genUsage ({ config: { name, help: { usage } } }: C.Command, { guild: { db } }: Message): Promise<string> {
		let correctUsage = `Correct usage: \`${(await db).config.prefix ?? defaults.prefix}${name} ${usage}\``;
		return `:x: Incorrect usage. ${usage ? correctUsage : ""}`;
	}
};

export const colors = {
	default: "#42aaf5",
	infractionLog: {
		added: "#1ee822",
		updated: "#1ec3e8",
		removed: "#ab0707"
	}
};

export const clientOptions: ClientOptions = {
	disableEveryone: true,
	defaultColor: colors.default,
	owners: admins,
	loggerOps: {
		name: "mod-bot",
		levels: [0, 1, 2, 3],
		enableLogs: process.env.NODE_ENV === "production",
		logDirectory: "build/utils/logs",
		format: "{{h12}} [{{clrst}}{{lvl}}{{clrend}}] {{name}}: {{clrst}}{{msg}}{{clrend}}",
		colorScheme: {
			useKeywords: true,
			info: "seagreen",
			warning: "khaki",
			error: "firebrick",
			debug: "steelblue"
		}
	},
	databaseOps: {
		url: process.env.MONGO,
		name: "mod-bot",
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	}
};

export const regex: { [key: string]: RegExp } = {
	invite: new RegExp("(?:^https?:\/\/)?(www\\.)?discord(app.com\/invite|.gg)\/([a-zA-Z-_])+", "g"),
	emoji: new RegExp("<(?:a)?:([aA-z-_]){0,32}:(\\d){16,18}>", "g")
};
