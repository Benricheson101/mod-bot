import { Command as C } from "@types";
import { admins } from "@utils/setup";
import { User } from "discord.js";
import * as moment from "moment";
import { exec as e } from "child_process";
import { promisify } from "util";
import { platform, release } from "os";
import ms = require("ms");

const { dependencies, devDependencies, repository } = require("~/../package.json");


export = {
	config: {
		name: "about",
		aliases: ["bot", "botinfo"],
		help: {
			description: "Get information about the bot",
			category: "info"
		}
	},

	async run (client, message, args) {

		const exec = promisify(e);

		let nodeVersion = (await exec("node -v")).stdout;

		let devs: User[] = [];
		for (let u of admins) {
			let user: User | null = await client.getUser(u);
			if (user) devs.push(user);
		}

		let authorInfo: string = `
		**Developer${admins.length === 1 ? "" : "s"}**: ${devs.map((u) => u.tag).join(", ")}
		`;

		let botInfo: string = `
		**User**: ${client.user.tag}
		**ID**: ${client.user.id}
		**Created**: ${moment(client.user.createdAt).fromNow()} (${moment(client.user.createdAt).format("YYYY-MM-DD hh:mm")})
		**Uptime**: ${ms(client.uptime)}
		`;

		//todo: memory
		let technicalInfo: string = `
		**Repository**: [GitHub](${repository})
		**Node Version**: ${nodeVersion.replace("\n", "")}
		**OS**: ${release()} (${platform()})
		**Dependencies (${Object.keys(dependencies).length})**: \n\`\`\`json\n${JSON.stringify(dependencies, null, 2)}\`\`\`
		`;

		let acknowledgements: string = `
		**Images**: [Chewey Bot API](https://api.chewey-bot.top/), [NASA AIOD API](https://api.nasa.gov/), https://blue.catbus.co.uk/
		`;

		let embed = client.defaultEmbed
			.addField("Author", authorInfo.replace(/\t+/g, ""))
			.addField("Bot", botInfo.replace(/\t+/g, ""))
			.addField("Technical", technicalInfo.replace(/\t+/g, "")) // too much?
			.addField("Acknowledgements", acknowledgements.replace(/\t+/g, ""));
		await message.channel.send({ embed: embed });
	}
} as C.Command;
