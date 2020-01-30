import { Database as D, Infraction } from "../types";
import Client from "./Client";
import { UpdateWriteOpResult } from "mongodb";
import { Message, MessageEmbed } from "discord.js";

export default class implements Infraction.Infraction {
	constructor (private _client: Client) {
	}

	async create (guild, inf) {
		let guildDb = await this._client.db.guilds.findOne({ id: guild });
		let infId = guildDb.infId += 1;
		inf.id = infId;
		await this._client.db.guilds.updateOne({ id: guild }, {
			$push: { infractions: inf },
			$set: { infId: infId }
		});
		return inf;
	}

	async getGuild (guild, infId?) {
		if (infId) {
			let { infractions } = await this._client.db.guilds.findOne({
				id: guild
			});
			return infractions.find((inf) => inf.id === +infId);
		}
		if (!infId) {
			let inf = await this._client.db.guilds.find({ id: guild });
			let infs = [];
			await inf.forEach((item: D.GuildDB) => {
				if (!item) return;
				infs.push(item.infractions);
			});
			return infs;
		}
	}

	async delete (guild, infraction) {
		let inf = this.getGuild(guild, infraction);
		if (!inf) return;
		let result: UpdateWriteOpResult = await this._client.db.guilds.updateOne({
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
		return this._client.defaultEmbed
			.setDescription(`**Moderator**: ${(await this._client.getUser(infraction.moderator)).tag} (${infraction.moderator})\n**Reason**: ${infraction.reason || "no reason provided"}`)
			.setTimestamp(infraction.date)
			.setFooter(`Type: ${infraction.type} | ID: ${infraction.id}`)
			.setAuthor(`${(await this._client.getUser(infraction.user)).tag} (${infraction.user})`, (await this._client.getUser(infraction.user)).displayAvatarURL({ format: "png" }));
	}
}
