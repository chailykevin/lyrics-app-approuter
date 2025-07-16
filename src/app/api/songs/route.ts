import { NextRequest, NextResponse } from "next/server";

import { db } from "@/index";
import { artist_song, songs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const allSongs = await db.query.songs.findMany({
      with: {
        artist_song: {
          with: {
            artist: true,
          },
        },
      },
    });

    const formattedSongs = allSongs.map((song) => ({
      id: song.id,
      title: song.title,
      lyrics: song.lyrics,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      artist: song.artist_song.map((link) => link.artist),
    }));

    return NextResponse.json(
      {
        message: "Sukses mengambil semua lagu",
        data: formattedSongs,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as unknown as Error;
    return NextResponse.json(
      {
        message: err.message,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, lyrics, artistIds } = await request.json();

    if (!title) {
      return NextResponse.json(
        {
          message: "Judul lagu tidak boleh kosong",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!lyrics) {
      return NextResponse.json(
        {
          message: "Lirik lagu tidak boleh kosong",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!artistIds || !Array.isArray(artistIds) || artistIds.length === 0) {
      return NextResponse.json(
        {
          message: "Pilih minimal satu artis",
          data: null,
        },
        { status: 400 }
      );
    }

    const newSong = await db.insert(songs).values({ title, lyrics });
    const newSongId = newSong[0].insertId;

    const songArtists = artistIds.map((artistId: number) => ({
      songId: newSongId,
      artistId: artistId,
    }));

    await db.insert(artist_song).values(songArtists);

    const newSongData = await db.query.songs.findFirst({
      where: eq(songs.id, newSongId),
      with: {
        artist_song: {
          with: {
            artist: true,
          },
        },
      },
    });

    const formattedSong = {
      ...newSongData,
      artists: newSongData!.artist_song.map((link) => link.artist),
    };
    delete formattedSong.artist_song;

    return NextResponse.json(
      {
        message: "Lagu berhasil dibuat",
        data: formattedSong,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const err = error as unknown as Error;
    return NextResponse.json(
      {
        message: err.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
