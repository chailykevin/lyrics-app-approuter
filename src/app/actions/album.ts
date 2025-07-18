"use server";

import { album_artist, album_song, albums } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { writeFile, unlink } from "fs/promises";
import { notFound } from "next/navigation";
import path from "path";
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

export async function addAlbum(formData: FormData, imageFile?: File) {
  const rawFormData = {
    title: formData.get("title"),
    releaseDate: formData.get("releaseDate"),
    artists: formData.getAll("artists").map(Number),
    songs: formData.getAll("songs").map(Number),
  };

  const validationData = await albumSchema.validate(rawFormData);

  let albumId: number;

  const filename = imageFile
    ? Date.now() + imageFile.name.replaceAll(" ", "_")
    : "default.png";

  await db.transaction(async (tx) => {
    const newAlbum = await tx.insert(albums).values({
      title: validationData.title,
      coverImagePath: `/${filename}`,
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

  if (imageFile) {
    const buffer = Buffer.from(await imageFile!.arrayBuffer());

    await writeFile(
      path.join(process.cwd(), "public/albumCover/" + filename),
      buffer
    );
  }

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

export async function editAlbum(
  formData: FormData,
  albumId: number,
  imageFile: File
) {
  const rawFormData = {
    title: formData.get("title"),
    releaseDate: formData.get("releaseDate"),
    artists: formData.getAll("artists").map(Number),
    songs: formData.getAll("songs").map(Number),
  };

  const validationData = await albumSchema.validate(rawFormData);

  const filename = imageFile
    ? Date.now() + imageFile.name.replaceAll(" ", "_")
    : "";

  const oldFileName = await db
    .select({ coverImagePath: albums.coverImagePath })
    .from(albums)
    .where(eq(albums.id, albumId));

  await db.transaction(async (tx) => {
    await tx
      .update(albums)
      .set(
        filename === ""
          ? {
              title: validationData.title,
              releaseDate: new Date(validationData.releaseDate),
            }
          : {
              title: validationData.title,
              coverImagePath: `/${filename}`,
              releaseDate: new Date(validationData.releaseDate),
            }
      )
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

  if (!(filename === "")) {
    //Delete, baru tambah baru
    await unlink(
      path.join(
        process.cwd(),
        "public/albumCover/" + oldFileName[0].coverImagePath
      )
    );

    // tambah baru
    if (imageFile) {
      const buffer = Buffer.from(await imageFile!.arrayBuffer());

      await writeFile(
        path.join(process.cwd(), "public/albumCover/" + filename),
        buffer
      );
    }
  }

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

  const oldFileName = await db
    .select({ coverImagePath: albums.coverImagePath })
    .from(albums)
    .where(eq(albums.id, rawFormData.id));

  await db.transaction(async (tx) => {
    await tx
      .delete(album_artist)
      .where(eq(album_artist.albumId, rawFormData.id));

    await tx.delete(album_song).where(eq(album_song.albumId, rawFormData.id));

    deletedAlbum = await tx.delete(albums).where(eq(albums.id, rawFormData.id));
  });

  if (!(oldFileName[0].coverImagePath === "/default.png")) {
    await unlink(
      path.join(
        process.cwd(),
        "public/albumCover/" + oldFileName[0].coverImagePath
      )
    );
  }

  if (deletedAlbum![0].affectedRows === 0) {
    return "Gagal";
  } else {
    return "Berhasil";
  }
}
