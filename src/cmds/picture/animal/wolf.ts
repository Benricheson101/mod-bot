import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "wolf",
		help: {
			description: "Get a picture of a wolf",
			category: "picture.animal"
		}
	},

	async run (client, message) {
		let { data } = await new Request()
			.chewey("/wolf");

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(data)
		});
	}
} as C.Command
