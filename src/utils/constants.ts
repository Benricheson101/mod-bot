import { Snowflake } from "discord.js";
import { Database as D } from "./types/custom";

export const defaultGuild = (guildId: Snowflake): D.GuildOps => {
	return {
		id: guildId,
		prefix: "!!"
	}
};
