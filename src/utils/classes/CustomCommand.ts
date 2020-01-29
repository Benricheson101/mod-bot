import Client from "./Client";
import { CustomCommand as CC, Database as D } from "../types";

export default class implements CC.CustomCommand {
	constructor (private _client: Client) {
	}

	async create (guild, command) {
		let guildDb: D.GuildDB = await this._client.db.guilds.findOne({ id: guild });
		let CCID = guildDb.CCID += 1;
		command.id = CCID;
		await this._client.db.guilds.updateOne({ id: guild }, {
			$push: { commands: command },
			$set: { CCID: CCID }
		});
		return command;
	}

	async delete (guild, command) {
		let guildCCs: D.CustomCommand[] = await this.getGuild(guild);
		let found = guildCCs.find((c) => c.name === command || c.id === +command);
		if (!found) return;
		let result = await this._client.db.guilds.updateOne({ id: guild }, {
			$pull: { commands: found }
		});
		return {
			result: result,
			deleted: found
		};
	}

	async getGuild (guild, CCID?) {
		if (CCID) {
			let { commands } = await this._client.db.guilds.findOne({
				id: guild
			});
			return commands.find((inf) => inf.id === +CCID);
		}
		if (!CCID) {
			let { commands }: D.GuildDB = await this._client.db.guilds.findOne({ id: guild });
			return commands;
		}
	}
}
