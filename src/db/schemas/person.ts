import { text, pgTable, date  } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';

export const users = pgTable("users", {
    id: text("id").$defaultFn(() => uuidv4()).primaryKey(),
    nickname: text("nickname").notNull().unique(),
    name: text("name").notNull(),
    birth: text("birth"),
    stack: text("stack"),
});