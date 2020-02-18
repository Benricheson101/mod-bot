import { Command as C } from "@types";
import { admins } from "@utils/constants";
import { User } from "discord.js";
import * as moment from "moment";
import { exec as e } from "child_process";
import { promisify } from "util";
import { platform, release } from "os";

const { dependencies, devDependencies, repository } = require("~/../package.json");


export = {
	config: {
		name: "about",
		aliases: ["bot", "botinfo"],
		help: {
			description: "Get information about the bot"
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
		**Username**: ${client.user.username},
		**ID**: ${client.user.id}
		**Created**: ${moment(client.user.createdAt).fromNow()} (${moment(client.user.createdAt).format("YYYY-MM-DD hh:mm")})
		`;

		//todo: memory
		let technicalInfo: string = `
		**Repository**: [GitHub](${repository})
		**Node Version**: ${nodeVersion.replace("\n", "")}
		**OS**: ${release()} (${platform()})
		**Dependencies (${Object.keys(dependencies).length})**: \n\`\`\`json\n${JSON.stringify(dependencies, null, 2)}\`\`\`
		**DevDependencies (${Object.keys(devDependencies).length})**: \n\`\`\`json\n${JSON.stringify(devDependencies, null, 2)}\`\`\`
		`;

		let acknowledgements: string = `
		**Animal Images**: [Chewey Bot API](https://chewey-bot.top/)
		`;

		let embed = client.defaultEmbed
			.addField("Author", authorInfo.replace(/\t+/g, ""))
			.addField("Bot", botInfo.replace(/\t+/g, ""))
			.addField("Technical", technicalInfo.replace(/\t+/g, "")) // too much?
			.addField("Acknowledgements", acknowledgements.replace(/\t+/g, ""));
		await message.channel.send({ embed: embed });
	}
} as C.Command;
