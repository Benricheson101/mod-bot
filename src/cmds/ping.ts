import { Command as C } from "@types";
import { Message } from "discord.js";

export = {
	config: {
		name: "ping",
		aliases: [],
		help: {
			description: "Get the bot's ping",
			example: "ping"
		}
	},

	async run (client, message) {
		let msg: Message = await message.channel.send(":ping_pong:");
		await msg.edit(`:ping_pong: Websocket latency: \`${client.ws.ping}ms\` Edit time: \`${msg.createdTimestamp - Date.now()}ms\``);
	}
} as C.Command;
