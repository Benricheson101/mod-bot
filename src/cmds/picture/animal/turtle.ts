import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "turtle",
    help: {
      description: "Get a picture of a turtle",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/turtle");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
