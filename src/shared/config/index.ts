import * as dotenv from "dotenv";
dotenv.config();

import { ConfigFactory, ConfigObject } from "@nestjs/config";

const config: ConfigFactory = (): ConfigObject => ({
  database: {
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: false,
  },
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  api: {
    url: process.env.API_URL,
    key: process.env.API_KEY,
  },
});

export default config;
