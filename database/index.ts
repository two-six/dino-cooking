import {MongoClient} from "https://deno.land/x/mongo@v0.29.1/mod.ts";
import logger from "../utils/logger.ts";

const data = JSON.parse(Deno.readTextFileSync('./database/.data.json'));
const client = new MongoClient();

logger.steps.info("Connecting to the database...");
try {
  await client.connect(
    `mongodb+srv://${data.username}:${data.password}@${data.cluster_url}`
    +`/${data.db_name}?authMechanism=SCRAM-SHA-1`
  );
  logger.steps.info("Connected to the database");
} catch(e) {
  logger.steps.error(e);
  logger.steps.warning("Couldn't connect to the database");
  client.close();
  Deno.exit(1);
}

export default client;