import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "space",
    help: {
      description: "Get a space picture",
      category: "picture"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/space");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
