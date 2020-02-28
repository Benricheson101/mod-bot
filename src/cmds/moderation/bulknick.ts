import { Command as C } from "@types";
import { errors } from "@utils/setup";
import { GuildMember } from "discord.js";
import { match } from "assert";

export = {
	config: {
		name: "bulknick",
		aliases: ["regexnick", "massnick"],
		role: "moderator",
		help: {
			description: "Nick a lot of people at once using [regex](https://www.regular-expressions.info/)!",
			permissions: ["MANAGE_NICKNAMES"],
			usage: "<regex> | <new-nick>",
			category: "moderation"
		}
	},

	async run (client, message, args) {
		if (!args[0]) return message.channel.send(await errors.genUsage(this, message));
		let [pattern, ...nick] = args.join(" ").split("|");

		let regexPattern = /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/;
		let isValidRegex: boolean = regexPattern.test(pattern);
		if (!isValidRegex) return message.channel.send(await errors.genUsage(this, message));

		//let matchPattern: RegExp = new RegExp(pattern);
		let flag = pattern.split(/\//)[pattern.split(/\//).length - 1];
		let matchPattern: RegExp = new RegExp(pattern.slice(0, -(flag.length + 1)).slice(1), /[a-z]*/.exec(flag)[0]);

		let members: GuildMember[] = await message
			.guild
			.members
			.cache
			.filter((m) => matchPattern.test(m.user.username)/*) || m.displayName && matchPattern.test(m.displayName)*/);

		/*try {
			for await (let m of members) {
				if (m.roles && m.roles.highest.position > message.guild.me.roles.highest.position) continue;
				await m.setNickname(nick.join(" "));
			}
		} catch (e) {
			console.error(e);
		}*/

		await message.channel.send(`:warning: This command is not finished.`)
		await message.channel.send(`**[Debug]** Matched users:\n- ${members.map((m) => m.user.tag).join("\n- ")}`, { code: "md", split: { char: "\n"}})


		console.log(members.map((m) => m.user.username));

	}
} as C.Command
