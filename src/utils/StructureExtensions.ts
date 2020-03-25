import { Guild, GuildMember, Snowflake, Structures } from "discord.js";
import Client from "./classes/Client";
import { Database } from "@types";
import { findBestMatch } from "string-similarity";

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

    /**
     * Get the guild's document
     * @returns {Promise<Database.GuildDB>}
     */
    get db (): Promise<Database.GuildDB> {
      return this._client.db.guilds.findOne({ id: this.id });
    }

    /**
     * Get a GuildMember by ID
     * @param {Snowflake} member - The member's ID
     * @returns {Promise<GuildMember>}
     */
    async getMember (member: Snowflake): Promise<GuildMember | null> {
      return this.members.cache.find(({ id }) => id === member)
        || await this.members.fetch(member)
        || null;
    }

    /**
     * Get a user by finding their username as a near match to a string
     * @param {string} username - The string to match
     * @param {boolean} nicknames - Should it look for nicknames too?
     * @returns {Promise<void>}
     */
    matchUsername (username: string, nicknames?: boolean): GuildMember | null {
      let members: GuildMember[] = this.members.cache.array();
      let lcMembers = members.map(({ user: { username: u }, displayName }: GuildMember) => {
        return nicknames ? u.toLowerCase() && displayName.toLowerCase() : u.toLowerCase();
      });

      let { bestMatchIndex, bestMatch: { rating } } = findBestMatch(username.toLowerCase(), lcMembers);
      if (rating < .3) return null;
      return members[bestMatchIndex];
    }
  };
});
