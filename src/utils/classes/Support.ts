import Client from "@classes/Client";
import {
  BitField, ChannelResolvable,
  Collection,
  Message, OverwriteData, OverwriteResolvable,
  PermissionOverwrites,
  PermissionResolvable,
  Permissions,
  Snowflake
} from "discord.js";


export class Support {

  user_tag: string;
  user_id: Snowflake;
  channel_id: Snowflake;
  roles: Snowflake[];
  private _client: Client;
  category?: ChannelResolvable;


  constructor (private _message, setup) {
    this._client = this._message.client;
    this.user_tag = this._message.author.tag;
    this.user_id = this._message.author.id;
    this.roles = setup.roles;
    this.category = setup?.category;
  }

  //todo: check if a channel has already been created
  //todo: assign ticket id numbers
  //todo: ticket database
  //todo: export log on ticket close
  //todo: save class instance?
  init () {
    this._message.guild.channels.create(
      this._formatTag(this.user_tag),
      {
        permissionOverwrites: this._generatePermissions(),
        topic: `Support ticket with ${this.user_tag} (${this.user_id}) | Opened: ${new Date().toLocaleString()} EST`,
        parent: this.category,
        reason: `Support ticket with ${this.user_tag} opened.`
      }
    )
      .then(console.log)
      .catch(console.error);
  }

  close (reason?: string) {

  }

  private _generatePermissions () {
    //let permissions = new Collection<Snowflake, OverwriteResolvable>();
    let permissions = [];
    for (let role in this.roles) {
      //permissions.set(role, {
      console.log(role);
      permissions.push({
        allow: 3072,
        id: this.roles[role]
      } as OverwriteData);

    }
    return permissions;
  }

  private _formatTag (tag: string) {
    //todo: cuts off first num of discrim?
    let format = new RegExp("[^a-zA-Z\\d\\s:]", "g");
    return tag.replace(format, "")
      .replace(/\d/, "-");
  }

}
