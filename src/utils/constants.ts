import { Message, PermissionString, Snowflake } from "discord.js";
import { Database as D, Command as C } from "@types";

export const admins = [
	"255834596766253057"
];

export const defaults = {
	prefix: "modbot:"
};

export const defaultGuild = (guildId: Snowflake): D.GuildDB => {
	return {
		id: guildId,
		config: {
			prefix: defaults.prefix,
			infNotify: true,
			roles: {},
			enabledLogs: []
		},
		infractions: [],
		infId: 0,
		commands: [],
		CCID: 0
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
