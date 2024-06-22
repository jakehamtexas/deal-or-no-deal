import {
  serial,
  text,
  timestamp,
  pgTable,
  index,
  char,
  uniqueIndex,
  pgView,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const player = pgTable(
  "player",
  {
    id: serial("id").primaryKey(),
    firstName: text("name").notNull(),
    lastName: text("name").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      playerIdx: index("player_name_idx").on(table.firstName, table.lastName),
    };
  },
);

export const playerView = pgView("player_view").as((queryBuilder) =>
  queryBuilder
    .select({
      id: player.id,
      name: sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
        "name",
      ),
    })
    .from(player),
);

export const page = pgTable(
  "page",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull().unique(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      urlIdx: index("page_url_idx").on(table.url),
    };
  },
);

export const wishlist = pgTable(
  "wishlist",
  {
    id: serial("id").primaryKey(),
    ownerId: serial("owner_id")
      .notNull()
      .references(() => player.id),
    pageId: serial("page_id")
      .notNull()
      .references(() => page.id),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      ownerIdx: index("wishlist_owner_idx").on(table.ownerId),
      pageIdx: index("wishlist_page_idx").on(table.pageId),
    };
  },
);

const DISPLAY_INDEX_ENUM = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
] as const;

export type OrderChar = (typeof DISPLAY_INDEX_ENUM)[number];

export const wishlistItem = pgTable(
  "wishlist_item",
  {
    id: serial("id"),
    name: text("name").notNull(),
    wishlistId: serial("wishlist_id")
      .notNull()
      .references(() => wishlist.id),
    pageId: serial("page_id")
      .notNull()
      .references(() => page.id),
    imageUrl: text("image_url").notNull(),
    displayIndex: char("display_index", {
      length: 1,
      // The entire lowercase alphabet, and ABCD
      enum: DISPLAY_INDEX_ENUM,
    })
      .notNull()
      .$type<OrderChar>(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      uniqueDisplayPerId: uniqueIndex("wishlist_item_display_unique_idx").on(
        table.wishlistId,
        table.displayIndex,
      ),
      nameIdx: index("wishlist_item_name_idx").on(table.name),
      wishlistIdx: index("wishlist_item_wishlist_idx").on(table.wishlistId),
      pageIdx: index("wishlist_item_page_idx").on(table.pageId),
      displayIdx: index("wishlist_item_display_idx").on(table.displayIndex),
    };
  },
);
