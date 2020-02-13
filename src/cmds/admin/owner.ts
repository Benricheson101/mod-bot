import { Command as C } from "@types";
import { Snowflake } from "discord.js";

export = {
	config: {
		name: "owner",
		ownerOnly: true,
		help: {
			hidden: true
		}
	},

	async run (client, message, args) {
		let subCmd = args.shift();
		let param = args.join(" ").split("|").map((p) => p.trim());
		switch (subCmd) {
			case ("exec"): {
				if (!args[0]) return message.react("⛔");
				// @ts-ignore
				let ops = param.shift();
				let p2 = (param.join(" ").split(" ")).map((p) => p.trim());
				console.log(p2);
				let commandName: string = p2.shift();
				console.log("param", param, "commandname", commandName, "p2", p2);
				let cmd: C.Command = client.commands.find((c) => c.config.name === commandName || (c.config.aliases && c.config.aliases.includes(commandName)));
				let newthing: any = {};
				let newAuthor;
				let obj: OwnerOps = JSON.parse(ops);
				if (obj.as) {
					newAuthor = await client.getUser(obj.as);
					newthing.author = newAuthor;
				}
				let newMsg = { ...message, ...newthing };
				console.table([message.author, newAuthor, newMsg.author]);
				console.log(param);
				await cmd.run(client, newMsg, p2)
					.catch(console.error);
				break;
			}
		}
	}
} as C.Command

interface OwnerOps {
	as?: Snowflake;
	in?: {
		channel: Snowflake;
		guild: Snowflake;
	};
}
