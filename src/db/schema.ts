import { relations } from "drizzle-orm";
import {
  date,
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
  lyrics: text("lyrics").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const albums = mysqlTable("albums", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  releaseDate: date().notNull(),
  coverImagePath: varchar("cover_image_path", { length: 500 })
    .default("/default.png")
    .notNull(),
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

export const album_artist = mysqlTable("album_artist", {
  albumId: int("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "restrict" }),
  artistId: int("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "restrict" }),
});

export const album_song = mysqlTable("album_song", {
  albumId: int("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "restrict" }),
  songId: int("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "restrict" }),
});

export const artistRelations = relations(artists, ({ many }) => ({
  artist_song: many(artist_song),
  album_artist: many(album_artist),
}));

export const songRelations = relations(songs, ({ many }) => ({
  artist_song: many(artist_song),
  album_song: many(album_song),
}));

export const albumRelations = relations(albums, ({ many }) => ({
  album_artist: many(album_artist),
  album_song: many(album_song),
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

export const albumArtistRelations = relations(album_artist, ({ one }) => ({
  album: one(albums, {
    fields: [album_artist.albumId],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [album_artist.artistId],
    references: [artists.id],
  }),
}));

export const albumSongRelations = relations(album_song, ({ one }) => ({
  album: one(albums, {
    fields: [album_song.albumId],
    references: [albums.id],
  }),
  song: one(songs, {
    fields: [album_song.songId],
    references: [songs.id],
  }),
}));
