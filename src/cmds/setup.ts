import { Command as C, Database as D } from "@types";
import { Role, Util } from "discord.js";
import { UpdateWriteOpResult } from "mongodb";
import { findBestMatch } from "string-similarity";

export = {
	config: {
		name: "setup",
		aliases: ["config", "settings", "cfg"],
		help: {
			description: "Setup the bot for your server",
			usage: "<setting> <value>"
		}
	},

	async run (client, message, args) {
		//todo: stop repeating those three strings
		let guild: D.GuildDB = await message.guild.db;
		if (!args[0]) return message.channel.send(JSON.stringify(guild.config, null, 2), { code: "JSON" });
		let sub: string = args[0];
		args.shift();

		switch (sub.toLowerCase()) {
			case ("prefix") : {
				if (!args[0]) return message.channel.send(`🕵️ The current prefix is \`${Util.escapeMarkdown(guild.config.prefix)}\``);
				let original = guild.config.prefix;
				let newCfg: D.GuildDB = guild;
				if (args.join(" ").length > 200) return message.channel.send(":x: That is too long to be the prefix!");
				newCfg.config.prefix = args.join(" ");
				let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);
				if (ok === 1) {
					if (nModified === 1) {
						return message.channel.send(`:white_check_mark: Successfully changed the prefix\n> Original: \`${Util.escapeMarkdown(original)}\`\n> Updated: \`${Util.escapeMarkdown(newCfg.config.prefix)}\``);
					} else return message.channel.send(":x: The prefix was not changed.");
				} else return message.channel.send(":x: An error occurred.");
			}
			case ("notify"):
			case ("infnotify") : {
				if (!args[0]) return message.channel.send(`🕵️ The bot **${guild.config.infNotify ? "will" : "will not"}** DM users upon adding infractions.`);

				let original: boolean = guild.config.infNotify;
				let value = trueOrFalse(args[0]);
				if (value === null) return message.channel.send(":x: Incorrect usage");
				let newCfg: D.GuildDB = guild;
				if (typeof value === "boolean") newCfg.config.infNotify = value;
				let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);

				if (ok === 1) {
					if (nModified === 1) {
						return message.channel.send(`:white_check_mark: Successfully changed the infraction notification setting\n> Original: \`${Util.escapeMarkdown(original.toString())}\`\n> Updated: \`${Util.escapeMarkdown(newCfg.config.infNotify.toString())}\``);
					} else return message.channel.send(":x: The infraction notification setting was not changed.");
				} else return message.channel.send(":x: An error occurred.");
			}

			case ("roles"): {
				if (!args[0]) return message.channel.send(`🕵️ Your current roles:\n> Moderator: \`${guild.config.roles.moderator ?? "None"}\`\n> Administrator: \`${guild.config.roles.admin ?? "None"}\``);
				//let original = guild.config.roles;
				let oAdmin = guild.config.roles.admin;
				let oMod = guild.config.roles.moderator;
				let newCfg = guild;

				if (args[0].toLowerCase() === "admin" || args[0].toLowerCase() === "administrator") {
					args.shift();
					if (!args[0]) return message.channel.send(`🕵 Your current admin role is: \`${guild.config.roles.moderator ?? "none"}\``);
					if (args[0] === "reset") {
						delete newCfg.config.roles.admin;
						let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);
						if (ok === 1) {
							if (nModified === 1) {
								return message.channel.send(":white_check_mark: Successfully deleted the admin role");
							} else return message.channel.send(":x: The admin role was not changed.");
						} else return message.channel.send(":x: An error occurred.");
					}

					let role = matchRoleName(args.join(" "))
						|| message.guild.roles.cache.find((r) => r.id === args[0]);
					if (!role) return message.channel.send(":x: I could not find that role.");
					newCfg.config.roles.admin = role.id;
					let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);
					if (ok === 1) {
						if (nModified === 1) {
							return message.channel.send(`:white_check_mark: Successfully changed the admin role\n> Original: \`${oAdmin ?? "none"}\`\n> Updated: \`${newCfg.config.roles.admin}\``);
						} else return message.channel.send(":x: The admin role was not changed.");
					} else return message.channel.send(":x: An error occurred.");
				}
				else if (args[0].toLowerCase() === "mod" || args[0].toLowerCase() === "moderator") {
					args.shift();
					if (!args[0]) return message.channel.send(`🕵 Your current moderator role is: \`${guild.config.roles.moderator ?? "none"}\``);
					if (args[0] === "reset") {
						delete newCfg.config.roles.moderator;
						let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);
						if (ok === 1) {
							if (nModified === 1) {
								return message.channel.send(":white_check_mark: Successfully deleted the mod role");
							} else return message.channel.send(":x: The mod role was not changed.");
						} else return message.channel.send(":x: An error occurred.");
					}

					let role = matchRoleName(args.join(" "))
						|| message.guild.roles.cache.find((r) => r.id === args[0]);
					if (!role) return message.channel.send(":x: I could not find that role.");
					newCfg.config.roles.moderator = role.id;
					let { result: { ok, nModified } } = await updateDocument(await message.guild.db, newCfg);
					if (ok === 1) {
						if (nModified === 1) {
							return message.channel.send(`:white_check_mark: Successfully changed the mod role\n> Original: \`${oMod ?? "none"}\`\n> Updated: \`${newCfg.config.roles.moderator}\``);
						} else return message.channel.send(":x: The mod role was not changed.");
					} else return message.channel.send(":x: An error occurred.");
				} else return message.channel.send(":x: Incorrect usage")
			}
			//todo: enabled logs, per role commands?
		}

		/**
		 * Update a guild's database document
		 * @param currentGuild - The current database document
		 * @param newCfg - The new configuration document
		 * @returns {Promise<void>}
		 */
		async function updateDocument (currentGuild, newCfg): Promise<UpdateWriteOpResult> {
			return await client.db.guilds.updateOne(currentGuild, {
				$set: newCfg
			});
		}

		/**
		 * Test if a string is the equivalent of true or false
		 * @param {string} string - The string to check
		 * @returns {boolean | void}
		 */
		function trueOrFalse (string: string): boolean | void {
			let trueValues: string[] = ["true", "yes", "on", "enable", "enabled"];
			let falseValues: string[] = ["false", "no", "off", "disable", "disabled"];
			if (trueValues.includes(string)) return true;
			if (falseValues.includes(string)) return false;
			return;
		}

		function matchRoleName (role: string): Role {
			let roles: Role[] = message.guild.roles.cache.array();
			let lcRoles = roles.map(({ name }: Role) => name.toLowerCase());

			let { bestMatchIndex, bestMatch: { rating } } = findBestMatch(role.toLowerCase(), lcRoles);
			if (rating < .3) return null;
			return roles[bestMatchIndex];
		}


	}
} as C.Command;
