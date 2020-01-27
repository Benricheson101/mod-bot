import { Command as C } from "../utils/types/custom";
import { GuildMember } from "discord.js";

export = <C.ICommand>{
	config: {
		name: "userinfs"
	},

	async run (client, message, args) {
		let member: GuildMember = message.mentions.members.first()
			|| message.guild.members.find((m: GuildMember) => m.id === args[0]);

		let guild = await message.guild.db;

		let userInf = guild.infractions.filter((inf) => inf.user === member.id);

		let userInfStr = JSON.stringify(userInf, null, 2);
		if (userInfStr.length > 2000) userInfStr = userInfStr.substring(0, 2000);

		await message.channel.send(userInfStr, { code: "JSON" });
	}
};
