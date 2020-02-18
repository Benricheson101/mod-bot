import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "otter",
		help: {
			description: "OTTEROTTEROTTEROTTEROTTER",
			category: "picture.animal"
		}
	},

	async run (client, message) {
		let { data } = await new Request()
			.chewey("/otter");

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(data)
		});
	}
} as C.Command
