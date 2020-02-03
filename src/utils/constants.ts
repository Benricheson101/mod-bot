import { PermissionString, Snowflake } from "discord.js";
import { Database as D } from "./types/index";

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
		roles: {}
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
	userPerms (permissions: PermissionString[]) {
		return `:x: You do not have permission to use this command. You must have \`${permissions}\``;
	},
	botPerms (permissions: PermissionString[]) {
		return `:x: I was not able to execute this command because I am missing the following permission${permissions.length === 1 ? "" : "s"}: \`${permissions}\``;
	}
};
