import { Command as C } from "@types";

export = {
	config: {
		name: "roles",
		aliases: ["rolelist", "role-list"],
		help: {
			description: "A list of all of the roles in the server",
			category: "info"
		}
	},

	async run (client, message) {
		let formattedRoles = message
			.guild
			.roles
			.cache
			.sort((a, b) => b.position - a.position)
			.map((r) => `${message.guild.roles.cache.size - r.position} ${r.name} - ${r.id} - ${r.members.size} ${r.members.size === 1 ? "member" : "members"}`);
		return message.channel.send(formattedRoles, {
			code: "md",
			split: {
				char: "\n"
			}
		});
	}
} as C.Command
