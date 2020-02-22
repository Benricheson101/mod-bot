import { Command as C, Database as D } from "@types";
import { errors } from "@utils/setup";
import { GuildMember, Util } from "discord.js";

export = {
	config: {
		name: "kick",
		channelType: "text",
		role: "moderator",
		help: {
			description: "Kick a user from the server",
			permissions: ["KICK_MEMBERS"],
			usage: "<user> [<reason>]",
			category: "moderation"
		}
	},
	async run (client, message, args) {
		let guild: D.GuildDB = await client.db.guilds.findOne({ id: message.guild.id });
		if (!message.member.permissions.has(2)) return message.channel.send(errors.userPerms(["KICK_MEMBERS"]));
		if (!message.guild.me.permissions.has(2)) return message.channel.send(errors.botPerms(["KICK_MEMBERS"]));
		if (!args[0]) return message.channel.send(errors.usage);
		let member: GuildMember = message.mentions.members.first()
			|| message.guild.members.find((m: GuildMember) => m.id === args[0]);
		if (!member) return message.channel.send(`:x: I could not find that user.`);
		if (!member.kickable) return message.channel.send(":x: I am not able to kick this user");

		let reason: string = args.slice(1).join(" ");

		let notified: string;
		if (guild.config.infNotify) {
			try {
				await member.send(`You were banned from \`${message.guild.name}\`${reason ? `\n> Reason: \`${reason}\`` : ""}`);
				notified = "User was notified.";
			} catch (err) {
				notified = "Unable to notify user.";
			}
		} else notified = "Infraction notifications are disabled for this server.";


		await member.kick(reason)
			.catch((err) => {
				client.log.warning(err);
				message.channel.send(errors.generic);
			});

		await client.infractions.create(message.guild, member.user, {
			date: new Date(),
			moderator: message.author.id,
			user: member.id,
			type: "kick",
			reason: reason
		} as D.Infraction);

		await message.channel.send(`:white_check_mark: Kicked \`${member.user.tag}\` (\`${member.id}\`) \n> Moderator: \`${message.author.tag}\` (\`${message.author.id}\`)${reason ? `\n> Reason: \`${reason}\`` : ""}`);
	}
} as C.Command;
