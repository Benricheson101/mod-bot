import { Command as C, Database, Infraction } from "../utils/types/custom";
import { errors } from "../utils/constants";
import { MessageEmbed, User } from "discord.js";

export = <C.ICommand>{
	config: {
		name: "infs",
		aliases: ["listinfs", "inflist", "inf-list", "list-infs"],
		role: "moderator"
	},

	async run (client, message, args) {
		let sub: string = args[0];
		if (sub) args = args.slice(1);

		// todo: paginate
		let guild = await message.guild.db;
		// let infs: string;
		switch (sub) {
			case ("member"):
			case ("user"): {
				// user infs
				if (!args[0]) return message.channel.send(errors.usage);
				let user: User = message.mentions.users.first() || await client.getUser(args[0]);
				if (!user) return message.channel.send(":x: I could not find that user");
				let userInfs = guild.infractions.filter((inf) => inf.user === user.id);
				if (!userInfs) return message.channel.send(":x: That user doesn't have any infractions");
				// infs = userInfs;
				await message.channel.send(await generateInfsEmbed(userInfs));
				break;
			}
			case ("server"):
			case ("guild"):
			default: {
				// guild infs
				let guildInfs = guild.infractions;
				if (!guildInfs) return message.channel.send(":x: This guild has no infractions");
				// infs = guildInfs;
				await message.channel.send(await generateInfsEmbed(guildInfs));
				break;
			}
		}

		/*infs = JSON.stringify(infs, null, 2);
		if (infs.length > 2000) infs = infs.substring(0, 2000);
		await message.channel.send(infs, { code: "JSON" });*/

		async function generateInfsEmbed (infs: Database.Infraction): Promise<MessageEmbed> {
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

	}
};
