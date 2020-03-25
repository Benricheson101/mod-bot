import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "nasa-iotd",
    aliases: [ "iotd", "nasa", "nasa_iotd", "nasa-image-of-the-day", "nasa_image_of_the_day", "apod" ],
    help: {
      description: "Get NASA's Astronomy Photo of the Day",
      category: "picture"
    }
  },

  async run (client, message, args) {
    let { explanation, title, url, hdurl, date } = await new Request()
      .nasa("/planetary/apod");
    let embed = client.defaultEmbed
      .setTitle(title)
      .setURL(hdurl)
      .setImage(url)
      .setTimestamp(date)
      .setFooter(explanation.substring(0, 2048));

    await message.channel.send(embed);
  }
} as C.Command;
