import { Database as D } from "@types";
import Client from "./Client";
import { MessageEmbed } from "discord.js";
import { colors } from "@utils/setup";

export class Logs {
	static async infLogEmbed (client: Client, infraction: D.Infraction, action: "added" | "removed" | "updated"): Promise<MessageEmbed> {
		let user = await client.getUser(infraction.user);
		let moderator = await client.getUser(infraction.moderator);
		return new MessageEmbed()
			.setAuthor(`${moderator.tag ?? "Moderator not found"} (${moderator.id ?? "Moderator not found"})`, moderator.displayAvatarURL({
				format: "png",
				dynamic: true
			}))
			.setTitle(`[DEBUG] Infraction ${action}`)
			.setDescription("```json\n" + JSON.stringify(infraction, null, 2) + "```")
			.setFooter(`Moderator: ${moderator.id ?? "Moderator not found"}
User: ${user.id ?? "User not found"}`)
			.setColor(colors.infractionLog[action])
			.setTimestamp();
	}
}
