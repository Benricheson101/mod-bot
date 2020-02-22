import { Command as C } from "../../utils/types/index";
import { Embed } from "@classes/Embed";

export = {
	config: {
		name: "cclist",
		aliases: ["cc-list", "ccs", "list-ccs"],
		role: "moderator",
		help: {
			description: "List all of the custom-commands for the server",
			usage: "[start-page-number] [--json]",
			category: "custom-commands"
		}
	},

	async run (client, message, args) {
		let content = [];
		let ccs = (await message.guild.db).commands;
		if (!ccs || !ccs.length) return message.channel.send(":x: There are no custom commands setup on this server");
		while (ccs.length > 0) {
			content.push("```JSON\n" + JSON.stringify(ccs.splice(0, 4), null, 2) + "```");
		}
		await Embed.pages(message, content, null, null, args[0]);
	}
} as C.Command;
