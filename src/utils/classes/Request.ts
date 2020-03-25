import { apiKeys } from "@utils/sensitive";
import { Request } from "@types";
import fetch, { RequestInit } from "node-fetch";

export default class implements Request {

  async chewey (path) {
    let baseUrl: string = "https://api.chewey-bot.top";
    let ops: RequestInit = {
      method: "get",
      headers: {
        authorization: apiKeys.chewey
      }
    };
    return await this._makeRequest(baseUrl + path, ops);
  }

  async betterE6 (path) {
    let baseUrl: string = "https://blue.catbus.co.uk/api";
    return await this._makeRequest(baseUrl + path);
  }

  async nasa (path) {
    let baseUrl: string = "https://api.nasa.gov";
    return await this._makeRequest(baseUrl + path + "?api_key=" + apiKeys.nasa);
  }

  async covid19 (path) {
    let baseUrl: string = "https://coronavirus-19-api.herokuapp.com";
    return await this._makeRequest(baseUrl + path);
  }

  async _makeRequest (url: string, ops?) {
    // @ts-ignore
    return await fetch(url, ops ?? { method: "get" })
      .then((r) => r.json())
      .catch(console.error) || {};
  }
}
