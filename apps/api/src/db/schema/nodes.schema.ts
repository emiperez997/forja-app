import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

export const nodes = pgTable('nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references((): AnyPgColumn => nodes.id, {
    onDelete: 'cascade',
  }),
  type: varchar('type', { length: 10 }).notNull(), // 'folder' | 'note'
  title: varchar('title', { length: 255 }).notNull().default('Sin título'),
  content: jsonb('content'), // null si es folder
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
