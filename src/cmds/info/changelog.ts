import { Command as C } from "@types";
import { promises } from "fs";

export = {
	config: {
		name: "changelog",
		aliases: ["changes"],
		help: {
			description: "Get the latest changelog for the bot",
			category: "info"
		}
	},

	async run (client, message) {
		let changelogs = await promises.readdir("changelogs");
		if (!changelogs) return message.channel.send(":x: An error occurred while trying to fetch the latest changelog.");

		let files = changelogs
			.filter((f) => f.match(/v+\d+.md/))
			.sort()
			.reverse();

		if (!files) return message.channel.send(":x: The author has not published any changelogs.");

		let latestChangelog = await promises.readFile(`changelogs/${files[0]}`, { encoding: "utf-8" });

		await message.channel.send(latestChangelog, {
			code: "md",
			split: true
		});
	}
} as C.Command;
