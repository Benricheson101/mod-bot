import { Guild, Structures } from "discord.js";
import Client from "./classes/Client";
import { Database } from "./types";
import GuildDB = Database.GuildDB;

Structures.extend("GuildMember", (GM) => {
	return class extends GM {
		_client: Client;

		constructor (client: Client, data: object, guild: Guild) {
			super(client, data, guild);
			this._client = client;
		}

		get db (): Promise<any> {
			return this._client.db.users.findOne({ id: this.id });
		}
	};
});

Structures.extend("Guild", (Guild) => {
	return class extends Guild {
		_client: Client;

		constructor (client: Client, data: object) {
			super(client, data);
			this._client = client;
		}

		get db (): Promise<GuildDB> {
			return this._client.db.guilds.findOne({ id: this.id });
		}
	};
});
