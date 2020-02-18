import { apiKeys } from "@utils/sensitive";
import fetch from "node-fetch";

export default class {
	constructor () {
	}

	async chewey (path: string): Promise<any> {
		let baseUrl: string = "https://api.chewey-bot.top";
		let ops: RequestInit = {
			method: "get",
			headers: {
				authorization: apiKeys.chewey
			}
		};
		return await this._request(baseUrl + path, ops);
	}

	async blue (path: string) {
		let baseUrl: string = "https://blue.catbus.co.uk/api";
		return await this._request(baseUrl + path);
	}

	private async _request (url: string, ops: any = { method: "get" }) {
		return await fetch(url, ops)
			.then((r) => r.json())
			.catch(console.error);
	}
}
