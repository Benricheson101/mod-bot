import { Command as C } from "@types";
import { admins } from "@utils/setup";
import { User } from "discord.js";
import * as moment from "moment";
import { exec as e } from "child_process";
import { promisify } from "util";
import { platform, release } from "os";
import ms = require("ms");

const { dependencies, repository } = require("~/../package.json");


export = {
	config: {
		name: "about",
		aliases: ["bot", "botinfo", "stats"],
		help: {
			description: "Get information about the bot",
			category: "info"
		}
	},

	async run (client, message) {

		const exec = promisify(e);

		let nodeVersion = (await exec("node -v")).stdout;
		let commit: string = (await exec("git rev-parse HEAD")).stdout;
		let commitDate: Date = new Date((await exec("echo $(git log -1 --pretty=format:'%ad')")).stdout);

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
		**Repository**: [GitHub](${repository})
		**Trello Board**: [Trello](https://trello.com/b/4k05DZVg/)
		`;

		let stats: string = `
		**Guilds**: ${client.guilds.cache.size}
		**Users**: ${client.users.cache.size}
		**Channels**: ${client.channels.cache.size}
		`;
		//todo: memory
		let technicalInfo: string = `
		**Node Version**: ${nodeVersion.replace("\n", "")}
		**OS**: ${release()} (${platform()})
		**Dependencies (${Object.keys(dependencies).length})**: \n\`\`\`json\n${JSON.stringify(dependencies, null, 2)}\`\`\`
		**Commit**: [${commit.replace("\n", "")}](${repository}/commit/${commit.replace("\n", "")})
		**Commit Date**: ${moment(commitDate).fromNow()} (${moment(commitDate).format("YYYY-MM-DD hh:mm")})
		`;

		let acknowledgements: string = `
		**Images**: [Chewey Bot API](https://api.chewey-bot.top/), [NASA AIOD API](https://api.nasa.gov/), [BetterE6](https://blue.catbus.co.uk/)
		`;

		let embed = client.defaultEmbed
			.addField("Author", authorInfo.replace(/\t+/g, ""))
			.addField("Bot", botInfo.replace(/\t+/g, ""))
			.addField("Stats", stats.replace(/\t+/g, ""))
			.addField("Technical", technicalInfo.replace(/\t+/g, "")) // too much?
			.addField("Acknowledgements", acknowledgements.replace(/\t+/g, ""));
		await message.channel.send({ embed: embed });
	}
} as C.Command;
