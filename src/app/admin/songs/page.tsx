export const dynamic = "force-dynamic";

import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import SongCard from "@/components/SongCard";
import { songs } from "@/db/schema";
import { db } from "@/index";
import { like, sql } from "drizzle-orm";
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

export default async function AdminSongsPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const search = searchParams?.search || 1;
  //GET all songs

  const songCount =
    search === 1
      ? await db.select().from(songs)
      : await db
          .select()
          .from(songs)
          .where(like(sql`lower(${songs.title})`, `%${search.toLowerCase()}%`));

  const allSongs =
    search === 1
      ? await db.query.songs.findMany({
          with: {
            artist_song: {
              with: {
                artist: true,
              },
            },
          },
          limit: 10,
          offset: (currentPage - 1) * 10,
        })
      : await db.query.songs.findMany({
          where: like(sql`lower(${songs.title})`, `%${search.toLowerCase()}%`),
          with: {
            artist_song: {
              with: {
                artist: true,
              },
            },
          },
          limit: 10,
          offset: (currentPage - 1) * 10,
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
      <div className="flex flex-row justify-between items-center">
        <Link
          href="/admin/songs/create"
          className="flex justify-center items-center bg-blue-500 text-white font-bold p-4 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-blue-700"
        >
          Tambah Data Baru
        </Link>

        <div>
          <SearchBar />
        </div>
      </div>
      {allSongs2.map((song: Song) => {
        return <SongCard key={song.id} song={song} />;
      })}
      <Pagination dataCount={songCount.length} />
    </>
  );
}
