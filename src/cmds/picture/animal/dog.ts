import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "dog",
		help: {
			description: "Get a picture of a dog",
			category: "picture.animal"
		}
	},

	async run (client, message) {
		let { data } = await new Request()
			.chewey("/dog");

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(data)
		});
	}
} as C.Command
