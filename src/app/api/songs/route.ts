import { NextRequest, NextResponse } from "next/server";

import { db } from "@/index";
import { artist_song, songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { songSchema } from "@/lib/validators/song";
import * as yup from "yup";

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
    const body = await request.json();

    const validateData = await songSchema.validate(body);

    const newSong = await db
      .insert(songs)
      .values({ title: validateData.title, lyrics: validateData.lyrics });
    const newSongId = newSong[0].insertId;

    const songArtists = validateData.artistIds.map((artistId) => ({
      songId: newSongId,
      artistId: parseInt(artistId!),
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
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
          data: null,
        },
        { status: 400 }
      );
    }

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
