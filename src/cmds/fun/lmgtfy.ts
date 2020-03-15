import { Command as C } from "@types";
import { errors } from "@utils/setup";

export = {
  config: {
    name: "lmgtfy",
    help: {
      category: "fun",
      description: "Generate a `LMGTFY` (let me Google that for you) link",
      usage: "<terms>",
      example: "how to make a Discord bot"
    }
  },

  async run (client, message, args) {
    if (!args[0]) return message.channel.send(await errors.genUsage(this, message));
    const path: string = encodeURIComponent(args.join(" "));
    const link: string = `https://lmgtfy.com/?q=${path}&s=d&iie=1`;

    if (link.length > 2000) return message.channel.send(":x: That's too long!");
    return message.channel.send(`:white_check_mark: Here is your lmgtfy link: <${link}>`);
  }
} as C.Command;
