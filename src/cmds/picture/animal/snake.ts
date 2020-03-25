import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "snake",
    help: {
      description: "Get a picture of a snake",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/snake");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
