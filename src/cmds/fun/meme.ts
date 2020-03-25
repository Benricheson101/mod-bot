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
      "dankmemes",
      "wholesomegreentext",
      "nukedmemes",
      "deepfriedmemes",
      "ilikethebred",
      "comedyseizure",
      "okbuddyretard",
      "lodeddiper",
      "subwaycreatures",
      "othepelican",
      "blursedimages",
      "absoluteunit",
      "bossfight",
      "boosfightuniverse",
      "targetedshirts",
      "itemshop",
      "birdsarentreal",
      "noearthsociety",
      "Tumblr"
    ];

    let randSource: any = sources[Math.floor(Math.random() * sources.length)];
    let url: string = `https://www.reddit.com/r/${randSource}.json?sort=hot&t=week`;
    let { data: { children } } = await new Request()._makeRequest(url);
    let posts: any[] = (message.channel.nsfw ? children : children.filter((p) => !p.over_18));

    let withImages: any[] = posts.map((p) => p.data).filter((p) => !!p.url === true && [ "gif", "png", "jpg", "peg" ].includes(p.url.slice(-3)));
    if (!withImages) return;

    let randInt: number = Math.floor(Math.random() * withImages.length);
    let post = withImages[randInt];

    if (!post) throw new Error("The request did not return an image and the filter did not catch it.");

    return message.channel.send({
      embed: client.defaultEmbed
        .setImage(post.url)
        .setAuthor(post.author)
        .setTitle(post.title)
        .setURL("https://reddit.com" + post.permalink)
    });
  }
} as C.Command
