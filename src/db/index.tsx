import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

// Inicialização do banco de dados
export const db = drizzle(process.env.DATABASE_URL!);
