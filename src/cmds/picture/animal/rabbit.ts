import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "rabbit",
    aliases: [ "bunny" ],
    help: {
      description: "Get a picture of a rabbit",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/rabbit");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
