import { Command as C } from "@types";
import { Message } from "discord.js";

export = {
  config: {
    name: "ping",
    aliases: [],
    help: {
      description: "Get the bot's ping",
      example: "ping",
      category: "other"
    }
  },

  async run (client, message) {
    let oldDate: Date = new Date();
    let msg: Message = await message.channel.send(":ping_pong:");
    await msg.edit(`:ping_pong: Websocket latency: \`${client.ws.ping}ms\` Bot Ping: \`${(+new Date() - +oldDate)}ms\``);
  }
} as C.Command;
