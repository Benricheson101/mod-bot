import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
  config: {
    name: "xkcd",
    help: {
      description: "Get an xkcd comic!",
      usage: "[ <comic-number> | random ]"
    }
  },

  async run (client, message, args) {
    let RequestClient = new Request();
    let latest: any = await RequestClient._makeRequest("https://xkcd.com/info.0.json");

    if (!isNaN(+args[0])) {
      if (args[0] > latest.num || +args[0] < 1 || +args[0] % 1 !== 0) return message.channel.send(`:x: That doesn't exist! Please choose a number between 1 and ${latest.num}.`);
      await generateEmbed(await RequestClient._makeRequest(`https://xkcd.com/${args[0]}/info.0.json`));
    } else if (args[0] === "latest") {
      await generateEmbed(latest);
    } else {
      await generateEmbed(await RequestClient._makeRequest(`https://xkcd.com/${Math.floor(Math.random() * latest.num) + 1}/info.0.json`));
    }

    /**
     * Generate and send an embed with the JSON data.
     * @param {Object} data - The JSON result
     * @param {string} data.title - The comic title
     * @param {number} data.num - The comic number
     * @param {string} data.img - The image link
     * @param {string} data.alt - The alt-text
     * @returns {Promise<Message>}
     */
    function generateEmbed (data) {
      let embed = new (require("discord.js")).MessageEmbed()
        .setTitle(data.title)
        .setAuthor(data.num)
        .setURL(`https://xkcd.com/${data.num}`)
        .setImage(data.img)
        .setFooter(`${data.alt} • ${data.year + "-" + ("0" + data.month).slice(-2) + "-" + ("0" + data.day).slice(-2)}`)
        .setColor("#3485e7");
      return message.channel.send({ embed: embed });
    }
  }
} as C.Command;
