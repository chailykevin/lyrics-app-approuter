export const dynamic = "force-dynamic";

import SongCard from "@/components/SongCard";
import { db } from "@/index";
import Link from "next/link";

type Song = {
  id: number;
  title: string;
  lyrics: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default async function AdminSongsPage() {
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

  return (
    <>
      <Link
        href="/admin/songs/create"
        className="bg-white p-4 my-2 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-gray-200"
      >
        Tambah Data Baru
      </Link>
      {allSongs2.map((song: Song) => {
        return <SongCard key={song.id} song={song} />;
      })}
    </>
  );
}
