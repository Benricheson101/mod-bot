import { Command as C, Database as D } from "../../utils/types";
import { GuildMember } from "discord.js";

export = {
	config: {
		name: "warn",
		aliases: ["warning", "add-inf"],
		channelType: "text"
		//role: "moderator"
	},

	async run (client, message, args) {
		let member: GuildMember = message.mentions.members.first()
			|| message.guild.members.find((m: GuildMember) => m.id === args[0]);
		if (!member) return message.channel.send(`:x: I could not find that user.`);

		if (message.author.id === member.id) return message.channel.send(":x: You can't warn yourself.");

		let reason: string = args.slice(1).join(" ");

		let db = await message.guild.db;
		let notified: string;
		if (db.config.infNotify) {
			try {
				await member.send(`You were warned in \`${message.guild.name}\`${reason ? `\n> Reason: \`${reason}\`` : ""}\n> Infraction ID: ${db.infId + 1}`);
				notified = "User was notified.";
			} catch (err) {
				notified = "Unable to notify user.";
			}
		} else notified = "Infraction notifications are disabled for this server.";

		await client.infractions.create(message.guild.id, <D.Infraction>{
			date: new Date(),
			moderator: message.author.id,
			user: member.id,
			type: "warn",
			reason: reason
		});

		await message.channel.send(`\`[${db.infId + 1}]\` Warned \`${member.user.tag}\` (\`${member.id}\`) \n> Moderator: \`${message.author.tag}\` (\`${message.author.id}\`)${reason ? `\n> Reason: \`${reason}\`` : ""}\n> Notified: ${notified}`);
	}
} as C.Command;
