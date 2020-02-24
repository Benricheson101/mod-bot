import { Command as C } from "@types";
import fetch from "node-fetch";
import Request from "@classes/Request";

export = {
	config: {
		name: "meme",
		help: {
			description: "Meme",
			category: "fun"
		}
	},

	async run (client, message, args) {
		let sources: string[] = [
			"dankmemes"
		];
		let source: string = sources[Math.floor(Math.random() * sources.length)];
		let url: string = `https://www.reddit.com/r/${source}.json?sort=hot&t=week`;

		let { data: { children } } = await new Request()._makeRequest(url);
		let posts: any[] = message.channel.nsfw ? children : children.filter((p) => !p.over_18);
		let randInt: number = Math.floor(Math.random() * posts.length);

		let { data: post } = posts[randInt];

		return message.channel.send({
			embed: client.defaultEmbed
				.setImage(post.url)
				.setAuthor(post.author)
				.setTitle(post.title)
				.setURL("https://reddit.com" + post.permalink)
		});

	}
} as C.Command
