import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "panda",
		help: {
			description: "Get a picture of a panda",
			category: "picture.animal"
		}
	},

	async run (client, message) {
		let { data } = await new Request()
			.chewey("/panda");

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(data)
		});
	}
} as C.Command
