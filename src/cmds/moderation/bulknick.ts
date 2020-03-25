import { Command as C } from "@types";
import { errors } from "@utils/setup";
import { GuildMember } from "discord.js";
import { match } from "assert";

export = {
  config: {
    name: "bulknick",
    aliases: [ "regexnick", "massnick" ],
    role: "moderator",
    disabled: true,
    help: {
      description: "Nick a lot of people at once using [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/)!",
      permissions: [ "MANAGE_NICKNAMES" ],
      usage: "<regex> | <new-nick>",
      category: "moderation"
    }
  },

  async run (client, message, args) {
    //todo: finish
    let [ pattern, ...nick ] = args.join(" ").split("|");
    if (!pattern) return message.channel.send(await errors.genUsage(this, message));

    let regexPattern = /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/;
    let isValidRegex: boolean = regexPattern.test(pattern);
    if (!isValidRegex) return message.channel.send(await errors.genUsage(this, message));

    let flag = pattern.split(/\//)[pattern.split(/\//).length - 1];
    let matchPattern: RegExp = new RegExp(pattern.slice(0, -(flag.length + 1)).slice(1), /[a-z]*/.exec(flag)[0]);

    let members: GuildMember[] = await message
      .guild
      .members
      .cache
      .filter((m) => matchPattern.test(m.user.username) || m.displayName && matchPattern.test(m.displayName)/*) || m.displayName && matchPattern.test(m.displayName)*/);

    try {

      for (const m of members) {
        if (m.roles.highest.comparePositionTo(message.guild.me.roles.highest) > 0) continue;
        await m.setNickname(nick.length > 0 ? nick.join(" ") : "", `Bulknick initiated by ${message.author.tag}`)
          .then((x) => console.log(x.user.tag));
      }

    } catch (e) {
      await message.channel.send(e.stack, { code: "JS" });
      console.error(e);
    }

    await message.channel.send(`:warning: This command is not finished.`);
    await message.channel.send(`**[Debug]** Matched users:\n- ${members.map((m) => m.user.tag).join("\n- ")}`, {
      code: "md",
      split: { char: "\n" }
    });
  }
} as C.Command
