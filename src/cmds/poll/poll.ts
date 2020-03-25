import { Command as C } from "@types";
import { errors } from "@utils/setup";
import { MessageEmbed } from "discord.js";

export = {
  config: {
    name: "poll",
    role: "moderator",
    help: {
      description: "Start a poll!",
      usage: "<question> | <choice> | <choice> | ... ]"
    }
  },

  async run (client, message, args) {
    if (!args[0]) return message.channel.send(await errors.genUsage(this, message));
    let [ question, ...choices ]: string[] = args.join(" ").split("|");

    if (!question || choices.length < 2) return message.channel.send(await errors.genUsage(this, message));
    if (choices.length >= 10) return message.channel.send(":x: Polls can have up to 10 choices");
    if (question.length > 256) return message.channel.send(":x: Due to embed limits, the question can only be 256 characters long.");

    let embed: MessageEmbed = client.defaultEmbed
    .setTitle(question);

    for (let choice of choices) {
      //embed.addField(`:${embed.fields.length += 1}:`, choice);
      embed.addField(choice, `:${numToEmojiName(embed.fields.length + 1)}:`)
    }

    let msg = await message.channel.send(embed);

//TODO: get unicode number emoji thing instead of string name word thing 

    function numToEmojiName (number) {
      const words = {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "keycap_ten"
      };

      const unicode = {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
        10: ""
      };
      return String(number).replace(/\d+/, (char) => words[char]);
    }

  }
} as C.Command
