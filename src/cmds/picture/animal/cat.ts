import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "cat",
    help: {
      description: "Get a picture of a cat",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/cat");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
