import { Command as C } from "@types";
import { Support } from "@classes/Support";

export = {
  config: {
    name: "ticket",
    aliases: [ "support", "new", "newticket", "new-ticket" ],
    ownerOnly: true,
    help: {
      description: "Open a new support ticket",
      category: "support"
    }
  },

  async run (client, message, args) {
    let guild = await client.db.find("guilds", { id: message.guild.id });
    //if (!guild.config.support || !guild.config.support) return message.channel.send(":x: This server has not setup the support module.");
    //	if (!message.guild.me.permissions.has(16)) return message.channel.send(":x: I do not have permission to create text channels. If you would like to use the support commands, please grant me `MANAGE_CHANNELS`");

    new Support(message, {
      roles: [ "652277508170973195" ]
    }).init();
  }
} as C.Command;
