import { PermissionString, Snowflake } from "discord.js";
import { Database as D } from "./types/index";

export const defaults = {
	prefix: "modbot:"
};

export const defaultGuild = (guildId: Snowflake): D.GuildDB => {
	return {
		id: guildId,
		prefix: defaults.prefix,
		mentionPrefix: true,
		infNotify: true,
		infractions: [],
		infId: 0,
		roles: {}
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
