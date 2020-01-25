import { Command as C } from "../utils/types/custom";
import { Message } from "discord.js";

export = <C.ICommand>{
	config: {
		name: "ping"
	},

	async run (client, message) {
		let msg: Message = await message.channel.send(":ping_pong:");
		await msg.edit(`:ping_pong: Websocket latency: \`${client.ws.ping}ms\` Edit time: \`${msg.createdTimestamp-Date.now()}ms\``);
	}
};
