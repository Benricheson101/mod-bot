import { Database as D, Database, Infraction } from "./types/index";
import Client from "./Client";
import GuildDB = Database.GuildDB;
import { UpdateWriteOpResult } from "mongodb";
import { Message, MessageEmbed } from "discord.js";

export default class implements Infraction.Infraction {
	constructor (private client: Client) {
	}

	async create (guild, inf) {
		let guildDb = await this.client.db.guilds.findOne({ id: guild });
		let totalInf = guildDb.infId += 1;
		inf.id = totalInf;
		await this.client.db.guilds.updateOne({ id: guild }, {
			$push: { infractions: inf },
			$set: { infId: totalInf }
		});
		return inf;
	}

	async getGuild (guild, infId?) {
		if (infId) {
			let { infractions } = await this.client.db.guilds.findOne({
				id: guild
			});
			return infractions.find((inf) => inf.id === +infId);
		}
		// todo: make this return the right thing
		if (!infId) {
			let inf = await this.client.db.guilds.find({ id: guild });
			let infs = [];
			await inf.forEach((item: GuildDB) => {
				if (!item) return;
				infs.push(item.infractions);
			});
			return infs;
		}
	}

	async delete (guild, infraction) {
		let inf = this.getGuild(guild, infraction);
		if (!inf) return;
		let result: UpdateWriteOpResult = await this.client.db.guilds.updateOne({
			id: guild,
			"infractions.id": +infraction
		}, {
			$pull: { infractions: { id: +infraction } }
		});
		return {
			result: result,
			oldInf: inf
		};
	}

	async generateInfEmbed (message: Message, infraction: D.Infraction): Promise<MessageEmbed> {
		return this.client.defaultEmbed
			.setDescription(`**Moderator**: ${(await this.client.getUser(infraction.moderator)).tag} (${infraction.moderator})\n**Reason**: ${infraction.reason || "no reason provided"}`)
			.setTimestamp(infraction.date)
			.setFooter(`Type: ${infraction.type} | ID: ${infraction.id}`)
			.setAuthor(`${(await this.client.getUser(infraction.user)).tag} (${infraction.user})`, (await this.client.getUser(infraction.user)).displayAvatarURL({ format: "png" }));
	}
}
