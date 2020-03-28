import { Command as C } from "@types";
import Request from "@classes/Request";
import { capitalize } from "@utils/Utils";

export = {
  config: {
    name: "coronavirus",
    aliases: ["covid19", "covid", "covid-19", "corona"],
    help: {
      description: "Get info about COVID-19",
      usage: "[country-code]",
      example: "usa",
      category: "info"
    }
  },

  async run(client, message, args) {
    const path = args[0] ? "/countries" : "/all";
    let data = await new Request()
    .covid19(path);

    if (args[0]) {
      const country = args.join(" ").toLowerCase();
      data = data.find(c => c.country.toLowerCase() === country);
    }

    if (!data || Object.keys(data).length < 1)
      return message.channel.send(":x: An error occurred. Please make sure the country code you included is valid.");

    await message.channel.send(generateEmbed(data));

    function generateEmbed(requestData) {
      let body: string[] = [];

      for (let key in requestData) {
        body.push(`**${capitalize(key)}**: ${/^[0-9]*$/.test(requestData[key]) ? parseFloat(requestData[key]).toLocaleString("en") : requestData[key].replace(/\n/g, "")}`);
      }

      return client.defaultEmbed
        .setTitle(`COVID-19 Info ${requestData.country ? "for " + requestData.country : "Worldwide"}`)
        .setURL("https://github.com/javieraviles/covidAPI")
        .setDescription(body.join("\n"));
    }
  }
} as C.Command;
