import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "duck",
    help: {
      description: "Get a picture of a duck",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/duck");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
