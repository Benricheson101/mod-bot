import { Command as C } from "@types";
import Request from "@classes/Request";

export = {
	config: {
		name: "dragon",
		help: {
			description: "Get a picture of a dragon",
			category: "animal"
		}
	},

	async run (client, message) {
		let { posts: data } = await new Request()
			.blue("/search?term=dragon+solo+feral+-young+-diaper+-overweight-traditional_media_(artwork)+-pregnant+rating:s+order:random&page=0&page_size=1&nsfw=false");
		let md5 = data[0].md5;

		await message.channel.send({
			embed: client.defaultEmbed
				.setImage(`https://static1.e926.net/data/${md5.substr(0, 2)}/${md5.substr(2, 2)}/${md5}.${data[0].ext}`)
				.setTitle(`By: ${data[0].artist}`)
				.setURL(data[0].sources[0])
		});
	}
} as C.Command
