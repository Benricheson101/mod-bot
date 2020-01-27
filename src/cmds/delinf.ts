import { Command as C } from "../utils/types/custom";
import { errors } from "../utils/constants";

export = <C.ICommand>{
	config: {
		name: "delinf",
		aliases: ["removeinf", "remove-inf", "rm-inf", "rminf", "del-inf"],
		role: "moderator"
	},

	async run (client, message, args) {
		if (!args[0] || typeof args[0] === "number") return message.channel.send(errors.usage);

		let { result, oldInf } = await client.infractions.delete(message.guild.id, args[0]);
		result = result.result;
		if (result.n === 0 || result.nModified === 0) return message.channel.send(`:x: I could not find an infraction with the ID: \`${args[0]}\``);
		if (result.ok !== 1) return message.channel.send(errors.generic);
		console.log(oldInf);
		await message.channel.send(`:white_check_mark: Successfully deleted infraction: \`${args[0]}\``, {embed: client.infractions.generateInfEmbed(message, await oldInf)});
	}
}
