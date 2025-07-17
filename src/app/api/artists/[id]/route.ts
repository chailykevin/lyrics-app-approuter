import { artist_song, artists } from "@/db/schema";
import { db } from "@/index";
import { artistSchema } from "@/lib/validators/artist";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artistId = Number(id);

  if (isNaN(artistId)) {
    return NextResponse.json(
      {
        message: "ID Artis harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const artist = await db
      .select()
      .from(artists)
      .where(eq(artists.id, artistId));

    if (artist.length === 0) {
      return NextResponse.json(
        {
          message: "Tidak ditemukan artis dengan ID tersebut",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Sukses mengambil data artis",
        data: artist[0],
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artistId = Number(id);

  if (isNaN(artistId)) {
    return NextResponse.json(
      {
        message: "ID Artis harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const validateData = await artistSchema.validate(body);

    const artist = await db
      .update(artists)
      .set({ name: validateData.name })
      .where(eq(artists.id, artistId));

    if (!artist[0].affectedRows) {
      return NextResponse.json(
        {
          message: "Artis tidak ditemukan",
          data: null,
        },
        { status: 400 }
      );
    }

    const updatedArtist = await db
      .select()
      .from(artists)
      .where(eq(artists.id, artistId));

    return NextResponse.json(
      {
        message: "Artis berhasil diupdate",
        data: updatedArtist[0],
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
        {
          status: 400,
        }
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artistId = Number(id);

  if (isNaN(artistId)) {
    return NextResponse.json(
      {
        message: "ID Artis harus berupa angka",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const existedSongs = await db
      .select({ songId: artist_song.songId })
      .from(artist_song)
      .where(eq(artist_song.artistId, artistId))
      .limit(1);

    if (existedSongs.length > 0) {
      return NextResponse.json(
        {
          message: "Artis masih memiliki lagu dan tidak dapat dihapus",
          data: null,
        },
        { status: 409 }
      );
    }

    const artist = await db.delete(artists).where(eq(artists.id, artistId));

    if (!artist[0].affectedRows) {
      return NextResponse.json(
        {
          message: "Artis tidak ditemukan",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Artis berhasil dihapus",
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
