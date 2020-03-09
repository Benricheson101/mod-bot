import { Command as C, Database as D } from "@types";
import { errors } from "@utils/setup";

export = {
	config: {
		name: "updateinf",
		aliases: ["reason", "changereason", "update-inf"],
		role: "moderator",
		channelType: "text",
		disabled: true,
		help: {
			description: "Change the reason for an infraction",
			usage: "<infId> [reason]",
			example: "1 The user was spamming after being told to stop",
			category: "moderation",
			hidden: true
		}
	},

	//todo: finish
	async run (client, message, args) {/*
		if (!args.length || !(/^\d+$/.test(args[0]))) return message.channel.send(await errors.genUsage(this, message));
		let gInf: D.Infraction = (await message.guild.db)
			.infractions
			.find((inf: D.Infraction) => inf.id === +args[0]);
		args.shift();
		if (!gInf) return message.channel.send(`:x: I couldn't find an infraction with the id`);
		let reason: string = args.join(" ");

		let changes = {
			reason: reason
		};

		let { result, oldInf, newInf } = await client.infractions.update(message.guild.id, gInf.id, changes);
		result = result.result;
		if (result.ok !== 1) return message.channel.send(errors.generic);
		let msg: string = `:pencil: Successfully modified infraction: \`${gInf.id}\`
		> Old Reason: ${oldInf.reason}
		> New Reason: ${newInf.reason}`;
		return await message.channel.send(msg.replace("	", ""));
	*/}

} as C.Command
