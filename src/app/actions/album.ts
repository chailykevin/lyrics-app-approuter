"use server";

import { album_artist, album_song, albums } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import * as yup from "yup";

const albumSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, "Album harus memiliki minimal 2 karakter")
    .required(),
  releaseDate: yup.string().required(),
  artists: yup
    .array(yup.number())
    .min(1, "Album harus memiliki minimal 1 artis")
    .required(),
  songs: yup
    .array(yup.number())
    .min(1, "Album harus memiliki minimal 1 lagu")
    .required(),
});

export async function addAlbum(formData: FormData) {
  const rawFormData = {
    title: formData.get("title"),
    releaseDate: formData.get("releaseDate"),
    artists: formData.getAll("artists").map(Number),
    songs: formData.getAll("songs").map(Number),
  };

  const validationData = await albumSchema.validate(rawFormData);

  let albumId: number;

  await db.transaction(async (tx) => {
    const newAlbum = await tx.insert(albums).values({
      title: validationData.title,
      releaseDate: new Date(validationData.releaseDate),
    });

    albumId = newAlbum[0].insertId;

    const albumArtists = validationData.artists.map((artistId) => ({
      albumId: albumId,
      artistId: artistId!,
    }));

    await tx.insert(album_artist).values(albumArtists);

    const albumSongs = validationData.songs.map((songId) => ({
      albumId: albumId,
      songId: songId!,
    }));

    await tx.insert(album_song).values(albumSongs);
  });

  const newAlbum = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId!));

  if (newAlbum.length === 1) {
    return "Sukses";
  } else {
    return "Gagal";
  }
}

export async function editAlbum(formData: FormData, albumId: number) {
  const rawFormData = {
    title: formData.get("title"),
    releaseDate: formData.get("releaseDate"),
    artists: formData.getAll("artists").map(Number),
    songs: formData.getAll("songs").map(Number),
  };

  const validationData = await albumSchema.validate(rawFormData);

  await db.transaction(async (tx) => {
    await tx
      .update(albums)
      .set({
        title: validationData.title,
        releaseDate: new Date(validationData.releaseDate),
      })
      .where(eq(albums.id, albumId));

    await tx.delete(album_artist).where(eq(album_artist.albumId, albumId));

    const albumArtists = validationData.artists.map((artistId) => ({
      albumId: albumId,
      artistId: artistId!,
    }));

    await tx.insert(album_artist).values(albumArtists);

    await tx.delete(album_song).where(eq(album_song.albumId, albumId));

    const albumSongs = validationData.songs.map((songId) => ({
      albumId: albumId,
      songId: songId!,
    }));

    await tx.insert(album_song).values(albumSongs);
  });

  const updatedAlbumData = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId));

  if (updatedAlbumData.length === 1) {
    return "Sukses";
  } else {
    return "Gagal";
  }
}

export async function deleteAlbum(formData: FormData) {
  const rawFormData = {
    id: Number(formData.get("albumId")),
  };

  if (!rawFormData.id || isNaN(rawFormData.id)) {
    notFound();
  }

  let deletedAlbum;

  await db.transaction(async (tx) => {
    await tx
      .delete(album_artist)
      .where(eq(album_artist.albumId, rawFormData.id));

    await tx.delete(album_song).where(eq(album_song.albumId, rawFormData.id));

    deletedAlbum = await tx.delete(albums).where(eq(albums.id, rawFormData.id));
  });

  if (deletedAlbum![0].affectedRows === 0) {
    return "Gagal";
  } else {
    return "Berhasil";
  }
}
