import { Guild, Structures } from "discord.js";
import Client from "./classes/Client";
import { Database } from "@types";

Structures.extend("GuildMember", (GM) => {
	return class extends GM {
		_client: Client;

		constructor (client: Client, data: object, guild: Guild) {
			super(client, data, guild);
			this._client = client;
		}

		get db (): Promise<Database.User> {
			return this._client.db.users.findOne({ id: this.id });
		}
	};
});

Structures.extend("User", (User) => {
	return class extends User {
		_client: Client;

		constructor (client: Client, data: object) {
			super(client, data);
			this._client = client;
		}

		get db (): Promise<Database.User> {
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

		get db (): Promise<Database.GuildDB> {
			return this._client.db.guilds.findOne({ id: this.id });
		}
	};
});
