import { artists } from "@/db/schema";
import { db } from "@/index";
import { artistSchema } from "@/lib/validators/artist";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

export async function GET(request: NextRequest) {
  try {
    const allArtists = await db.select().from(artists);

    return NextResponse.json(
      {
        message: "Sukses mengambil data artis",
        data: allArtists,
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

    const validateData = await artistSchema.validate(body);

    const response = await db
      .insert(artists)
      .values({ name: validateData.name });
    const newArtistId = response[0].insertId;

    const newArtist = await db
      .select()
      .from(artists)
      .where(eq(artists.id, newArtistId));

    return NextResponse.json(
      {
        message: "Artis telah ditambahkan",
        data: newArtist[0],
      },
      { status: 201 }
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
