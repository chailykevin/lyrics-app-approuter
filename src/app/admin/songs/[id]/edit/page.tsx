import AdminSongForm from "@/components/SongForm";
import { artists, songs } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function AdminSongFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //GET one song
  const { id } = await params;
  const songId = Number(id);

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
    notFound();
  }

  const formattedSong = {
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
  };

  //GET all artists

  const allArtists = await db.select().from(artists);

  const formattedArtists = allArtists.map((artist) => ({
    ...artist,
    createdAt: artist.createdAt.toISOString(),
    updatedAt: artist.updatedAt.toISOString(),
  }));

  return (
    <AdminSongForm id={id} song={formattedSong} artists={formattedArtists} />
  );
}
