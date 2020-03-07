import { Command as C } from "@types";
import { promisify } from "util";
import { exec } from "child_process";

export = {
	config: {
		name: "exec",
		ownerOnly: true,
		help: {
			description: "Run a shell command",
			hidden: true,
			category: "admin"
		}
	},
	async run (client, message, args) {
		if (!args[0]) return message.channel.send(":x:");
		let execAsync = promisify(exec);
		let result = await execAsync(args.join(" "));
		await message.channel.send(result.stdout.substr(0, 1800), { code: "bash" });
	}
} as C.Command;
