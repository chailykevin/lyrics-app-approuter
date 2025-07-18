import AdminAlbumForm from "@/components/AlbumForm";
import { albums, artists } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function AdminAlbumFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = Number(id);

  const response = await db.query.albums.findFirst({
    where: eq(albums.id, albumId),
    with: {
      album_artist: {
        with: {
          artist: true,
        },
      },
      album_song: {
        with: {
          song: {
            with: {
              artist_song: {
                with: {
                  artist: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response) {
    notFound();
  }

  const album = {
    id: response.id,
    title: response.title,
    coverImagePath: response.coverImagePath,
    releaseDate: format(
      new Date(response.releaseDate.toISOString()),
      "yyyy-MM-dd"
    ),
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString(),
    artists: response.album_artist.map((link) => ({
      ...link.artist,
      createdAt: link.artist.createdAt.toISOString(),
      updatedAt: link.artist.updatedAt.toISOString(),
    })),
    songs: response.album_song.map((link) => ({
      ...link.song,
      createdAt: link.song.createdAt.toISOString(),
      updatedAt: link.song.updatedAt.toISOString(),
      artists: link.song.artist_song.map((link) => ({
        ...link.artist,
        createdAt: link.artist.createdAt.toISOString(),
        updatedAt: link.artist.updatedAt.toISOString(),
      })),
    })),
  };

  const allArtists = await db.select().from(artists);

  const formattedArtists = allArtists.map((artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  //GET all songs

  const allSongs = await db.query.songs.findMany({
    with: {
      artist_song: {
        with: {
          artist: true,
        },
      },
    },
  });

  const allSongs2 = allSongs.map((song) => ({
    id: song.id,
    title: song.title,
    lyrics: song.lyrics,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString(),
    artists: song.artist_song.map((link) => ({
      ...link.artist,
      createdAt: link.artist.createdAt.toISOString(),
      updatedAt: link.artist.updatedAt.toISOString(),
    })),
  }));

  return (
    <AdminAlbumForm
      id={albumId}
      album={album}
      artists={formattedArtists}
      songs={allSongs2}
    ></AdminAlbumForm>
  );
}
