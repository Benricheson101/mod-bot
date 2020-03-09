import { Database } from "@classes/Database";
import { Database as D } from "@types";

export default class extends Database {
	constructor (private mongoConfig: D.MongoConfig) {
		super(mongoConfig);
	}

	async save (type: string, data: any) {
		console.log("type", type, "data", data);
	}

}
