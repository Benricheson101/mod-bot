import Client from "@classes/Client";

export = async (client: Client, error) => {
	console.error("here", error);

	let err = client.tracker.errorToObject(error);

	await client
		.tracker
		.insert("error", err)
		.then(() => console.log("saved"));
}
