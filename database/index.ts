import {MongoClient} from "https://deno.land/x/mongo@v0.29.1/mod.ts";

const data = JSON.parse(Deno.readTextFileSync('./database/.data.json'));
const client = new MongoClient();

await client.connect(
    `mongodb+srv://${data.username}:${data.password}@${data.cluster_url}`
    +`/${data.db_name}?authMechanism=SCRAM-SHA-1`
);

export default client;