import { Database as D, Infraction } from "@types";
import Client from "./Client";
import { UpdateWriteOpResult } from "mongodb";
import { MessageEmbed } from "discord.js";

export default class implements Infraction.Infraction {
	constructor (private _client: Client) {
	}

	async create (guild, user, inf) {
		let guildDb = await this._client.db.guilds.findOne({ id: guild.id });
		let infId = guildDb.infId += 1;
		inf.id = infId;
		await this._client.db.updateRaw("guilds",{ id: guild.id }, {
			$push: { infractions: inf },
			$set: { infId: infId }
		});

		this._client.emit("infCreate", guild, user, inf);

		return inf;
	}

	async getGuild (guild, infId?) {
		if (infId) {
			let { infractions } = await this._client.db.find("guilds",{
				id: guild
			});
			return infractions.find((inf: D.Infraction) => inf.id === +infId);
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
		let inf: Promise<D.Infraction> = await this.getGuild(guild.id, infraction);
		if (!inf) return;
		let user = await this._client.getUser((await inf).user);
		let result: UpdateWriteOpResult = await this._client.db.updateRaw("guilds",{
			id: guild.id,
			"infractions.id": +infraction
		}, {
			$pull: { infractions: { id: +infraction } }
		});

		this._client.emit("infDelete", guild, user, inf);

		return {
			result: result,
			oldInf: inf
		};
	}

	async update (guild, infraction, changes) {
		let inf: D.Infraction = await this.getGuild(guild, infraction);
		if (!inf) return;
		let newInf: D.Infraction = { ...inf, ...changes };
		let result: UpdateWriteOpResult = await this._client
			.db
			.guilds
			.replaceOne({ id: guild }, { $set: {

				} });
		return {
			result: result,
			oldInf: inf,
			newInf: newInf
		};
	}

	async generateInfEmbed (infraction: D.Infraction): Promise<MessageEmbed> {
		return this._client.defaultEmbed
			.setDescription(`**Moderator**: ${(await this._client.getUser(infraction.moderator)).tag} (${infraction.moderator})\n**Reason**: ${infraction.reason || "no reason provided"}`)
			.setTimestamp(infraction.date)
			.setFooter(`Type: ${infraction.type} | ID: ${infraction.id}`)
			.setAuthor(`${(await this._client.getUser(infraction.user)).tag} (${infraction.user})`, (await this._client.getUser(infraction.user)).displayAvatarURL({ format: "png" }));
	}
}
