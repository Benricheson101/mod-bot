import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "bird",
		aliases: ["birb"],
		help: {
			description: "Get a picture of a bird",
			category: "animal"
		}
	},

	async run (client, message) {
		let { data } = await new Request()
			.chewey("/birb");

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(data)
		});
	}
} as C.Command
