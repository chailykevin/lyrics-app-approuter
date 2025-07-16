import { relations } from "drizzle-orm";
import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const artists = mysqlTable("artists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const songs = mysqlTable("songs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  lyrics: text("lyrics"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const artist_song = mysqlTable("artist_song", {
  artistId: int("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "restrict" }),
  songId: int("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "restrict" }),
});

export const artistRelations = relations(artists, ({ many }) => ({
  artist_song: many(artist_song),
}));

export const songRelations = relations(songs, ({ many }) => ({
  artist_song: many(artist_song),
}));

export const artistsongRelations = relations(artist_song, ({ one }) => ({
  artist: one(artists, {
    fields: [artist_song.artistId],
    references: [artists.id],
  }),
  song: one(songs, {
    fields: [artist_song.songId],
    references: [songs.id],
  }),
}));
