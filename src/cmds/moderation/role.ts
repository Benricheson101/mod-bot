import { Command as C } from "@types";
import { errors } from "@utils/setup";
import { GuildMember, Role } from "discord.js";
import { findBestMatch } from "string-similarity";

export = {
	config: {
		name: "role",
		role: "moderator",
		help: {
			description: "modify a user's roles",
			permissions: ["MANAGE_ROLES"],
			usage: "[{add|remove} {role}] [| {user}]",
			category: "moderation"
		}
	},

	async run (client, message, args) {
		if (!message.member.permissions.has(268435456)) return message.channel.send(errors.userPerms(["MANAGE_ROLES"])); // manage roles
		if (!message.guild.me.permissions.has(268435456)) return message.channel.send(errors.botPerms(["MANAGE_ROLES"]));

		let subCmd = args.shift();

		let formattedRoles = message.guild.roles.cache.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)).map((r) => `- ${r.name}`);
		if (!subCmd) return message.channel.send(formattedRoles, {
			code: "md",
			split: {
				char: "\n"
			}
		});


		if (!args[0]) return message.channel.send(await errors.genUsage(this, message));

		let [role, ...user] = args.join(" ").split("|");

		let foundRole: Role = findRole(role);
		if (!foundRole) return message.channel.send(":x:"); // :x:

		let member: GuildMember = message.mentions.members.first()
			|| findMemberByUsername(user.join())
			|| await message.guild.getMember(user);
		if (!member) return message.channel.send(":x:");

		switch (subCmd) {
			case ("+"):
			case ("give"):
			case ("add"): {
				if (member.roles.cache.has(foundRole.id)) return message.channel.send(":exclamation: This user already has that role!");
				let compareAuthorRoles = message.member.roles.highest.comparePositionTo(foundRole);
				if (message.guild.me.roles.highest.comparePositionTo(foundRole) < 1) return message.channel.send(":x: I cannot interact with roles higher than my highest role.");
				if (compareAuthorRoles < 1 && !message.guild.owner === message.member) return message.channel.send(":x: You cannot add roles higher than your highest role.");
				await member.roles.add(foundRole)
					.then(() => {
						message.channel.send(`:white_check_mark: Added \`${foundRole.name}\` to ${member.user.tag}`);
					})
					.catch(console.error);
				break;
			}
			case ("-"):
			case ("take"):
			case ("remove"): {
				//todo: apparently something is wrong with this
				if (!member.roles.cache.has(foundRole.id)) return message.channel.send(":exclamation: This user does not have that role!");
				let compareAuthorRoles = message.member.roles.highest.comparePositionTo(foundRole);
				if (message.guild.me.roles.highest.comparePositionTo(foundRole) < 1) return message.channel.send(":x: I cannot interact with roles higher than my highest role.");
				if (compareAuthorRoles < 1 && !message.guild.owner === message.member) return message.channel.send(":x: You cannot remove roles higher than your highest role.");
				await member.roles.remove(foundRole)
					.then(() => {
						message.channel.send(`:white_check_mark: Removed \`${foundRole.name}\` from ${member.user.tag}`);
					})
					.catch(console.error);
				break;
			}
		}

		function findRole (words: string): Role {
			let role = message.mentions.roles.first()
				|| message.guild.roles.cache.find((r) => r.id === words);
			if (role) return role;

			let guildRoles: Role[] = message.guild.roles.cache.array();
			let roleArray = guildRoles.map((r) => r.name.toLowerCase());

			let { bestMatchIndex, bestMatch: { rating } } = findBestMatch(words.toLowerCase(), roleArray);
			if (rating < .3) return null;
			return guildRoles[bestMatchIndex];
		}

		//todo: check tag instead of just username
		function findMemberByUsername (username: string): GuildMember {
			let members: GuildMember[] = message.guild.members.cache.array();
			let lcMembers = members.map(({ user: { username: u } }: GuildMember) => u.toLowerCase());

			let { bestMatchIndex, bestMatch: { rating } } = findBestMatch(username.toLowerCase(), lcMembers);
			if (rating < .3) return null;
			return members[bestMatchIndex];
		}

	}

} as C.Command;
