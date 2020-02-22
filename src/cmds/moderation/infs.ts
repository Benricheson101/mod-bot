import { Command as C, Database } from "@types";
import { errors } from "@utils/setup";
import { MessageEmbed, User } from "discord.js";
import { Embed } from "@classes/Embed";

export = {
	config: {
		name: "infs",
		aliases: ["listinfs", "inflist", "inf-list", "list-infs"],
		role: "moderator",
		help: {
			description: "Get a list of all infractions from the server or export them to a JSON file",
			usage: "[<user|guild|export>] [<user>]",
			category: "moderation"
		}
	},

	async run (client, message, args) {
		let sub: string = args[0];
		if (sub) args = args.slice(1);

		let guild = await message.guild.db;
		if (!guild.infractions || guild.infractions.length === 0) return message.channel.send(":x: There are no infractions for this server.");

		switch (sub) {
			case ("member"):
			case ("user"): {
				if (!args[0]) return message.channel.send(errors.usage);
				let user: User = message.mentions.users.first() || await client.getUser(args[0]);
				if (!user) return message.channel.send(":x: I could not find that user");
				let userInfs: Database.Infraction[] = guild.infractions.filter((inf: Database.Infraction) => inf.user === user.id);
				if (!userInfs) return message.channel.send(":x: That user doesn't have any infractions");
				await generateEmbedArr(userInfs, { start: args[1], perEmbed: 4 });
				break;
			}
			/*case ("guild"):
			case ("server"): {
				await generateEmbedArr((await message.guild.db).infractions, { start: args[0], perEmbed: 4 });
				break;
			}*/
			case ("export"): {
				let date = new Date();
				await message.channel.send(
					{
						files: [{
							name: `infractions-${message.guild.id}-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.json`,
							attachment: Buffer.from(JSON.stringify(guild.infractions, null, 2), "utf-8")
						}]
					});
				break;
			}
			default: {
				await generateEmbedArr(guild.infractions, { start: sub, perEmbed: 4 });
				break;
			}
		}

		async function generateInfsEmbed (infs: Database.Infraction[]): Promise<MessageEmbed> {
			let embed = client.defaultEmbed
				.setFooter("Note: Only 25 infractions can be shown at once");
			let timesRun = 0;
			for (let inf in infs) {
				if (timesRun >= 25) break;
				if (infs.hasOwnProperty(inf)) {
					let infraction: Database.Infraction = infs[inf];
					let moderator: User = await client.getUser(infraction.moderator);
					let user: User = await client.getUser(infraction.user);

					embed.addField(
						`Infraction ID: ${infs[inf].id}`,
						`**User**: ${user.tag ?? "*Unable to get user*"} (${infraction.user})\n**Moderator**: ${moderator.tag ?? "*Unable to find user**"} (${infraction.moderator})${infraction.reason ? `\n**Reason**: ${infraction.reason}` : ""}\n**Date**: ${infraction.date}\n​`
					);
				}
			}
			return embed;
		}

		async function generateEmbedArr (g: any[], ops: any) {
			let content = [];
			let length: number = g.length;
			let perEmbed: number = ops.perEmbed ?? 4;
			let start: number = --ops.start ?? 0;
			let totalPages: number = Math.ceil(length / perEmbed);
			console.log(start, args);
			if (isNaN(start) || start > totalPages || start < 1) start = 0;
			console.log(start);

			while (g.length > 0) {
				let arr = g.splice(0, perEmbed);
				if (args.includes("--json")) {
					content.push("```JSON\n" + JSON.stringify(arr, null, 2) + "```");
				} else {
					let embed = client.defaultEmbed
						.setFooter(`Page: ${content.length + 1} of ${totalPages} | Total Infractions: ${length}`);
					arr.forEach((infraction: Database.Infraction) => {
						let c = [];
						for (let key in infraction) {
							if (infraction.hasOwnProperty(key)) {
								if (!infraction[key]) break;
								c.push(`**${key}**: ${infraction[key]}`);
							}
						}
						embed.addField(`ID: ${infraction.id}`, c.join("\n"));
					});
					content.push(embed);
				}
			}
			await Embed.pages(message, content, null, null, start);
			return content;
		}
	}
} as C.Command;
