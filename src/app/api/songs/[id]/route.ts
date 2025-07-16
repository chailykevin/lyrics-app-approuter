import { artist_song, songs } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { songSchema } from "@/lib/validators/song";
import * as yup from "yup";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = await params;
  const songId = Number(id);

  if (isNaN(songId)) {
    return NextResponse.json(
      {
        message: "Id lagu harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const song = await db.query.songs.findFirst({
      where: eq(songs.id, songId),
      with: {
        artist_song: {
          with: {
            artist: true,
          },
        },
      },
    });

    if (!song) {
      return NextResponse.json(
        {
          message: "Lagu tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    const formattedSong = {
      id: song.id,
      title: song.title,
      lyrics: song.lyrics,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
      artists: song.artist_song.map((link) => link.artist),
    };

    return NextResponse.json(
      {
        message: "Lagu berhasil diambil",
        data: formattedSong,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = await params;
  const songId = Number(id);

  if (isNaN(songId)) {
    return NextResponse.json(
      {
        message: "Id lagu harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const validateData = await songSchema.validate(body);

    await db
      .update(songs)
      .set({ title: validateData.title, lyrics: validateData.lyrics })
      .where(eq(songs.id, songId));

    await db.delete(artist_song).where(eq(artist_song.songId, songId));

    const songArtists = validateData.artistIds.map((artistId) => ({
      songId: songId,
      artistId: parseInt(artistId!),
    }));

    await db.insert(artist_song).values(songArtists);

    const updatedSongData = await db.query.songs.findFirst({
      where: eq(songs.id, songId),
      with: {
        artist_song: {
          with: {
            artist: true,
          },
        },
      },
    });

    if (!updatedSongData) {
      return NextResponse.json(
        {
          message: "Gagal mengambil data setelah update",
          data: null,
        },
        { status: 404 }
      );
    }

    const formattedSong = {
      id: updatedSongData.id,
      title: updatedSongData.title,
      lyrics: updatedSongData.lyrics,
      createdAt: updatedSongData.createdAt,
      updatedAt: updatedSongData.updatedAt,
      artists: updatedSongData.artist_song.map((link) => link.artist),
    };

    return NextResponse.json(
      {
        message: "Lagu berhasil diupdate",
        data: formattedSong,
      },
      { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = await params;
  const songId = Number(id);

  if (isNaN(songId)) {
    return NextResponse.json(
      {
        message: "Id lagu harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    await db.delete(artist_song).where(eq(artist_song.songId, songId));

    const song = await db.delete(songs).where(eq(songs.id, songId));

    if (!song[0].affectedRows) {
      return NextResponse.json(
        {
          message: "Lagu tidak ditemukan",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Lagu berhasil dihapus",
        data: null,
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
