import Client from "@classes/Client";

export = async (client: Client, error: Error) => {
  await client.stats.error(error);
}
