export const dynamic = "force-dynamic";

import AdminAlbumForm from "@/components/AlbumForm";
import { artists } from "@/db/schema";
import { db } from "@/index";

export default async function AdminNewAlbumPage() {
  //GET all artists

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
    })), // <--- Perbaiki nama properti di sini
  }));

  return <AdminAlbumForm artists={formattedArtists} songs={allSongs2} />;
}
