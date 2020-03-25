import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "fox",
    help: {
      description: "Get a picture of a fox!",
      category: "animal"
    }
  },

  async run (client, message) {
    let { data } = await new Request()
      .chewey("/fox");

    await message.channel.send({
      embed: client.defaultEmbed
        .setImage(data)
    });
  }
} as C.Command
