export const dynamic = "force-dynamic";

import ArtistCard from "@/components/ArtistCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { artists } from "@/db/schema";
import { db } from "@/index";
import { like, sql } from "drizzle-orm";
import Link from "next/link";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default async function AdminArtistsPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const search = searchParams?.search || 1;

  const artistCount =
    search === 1
      ? await db.select().from(artists)
      : await db
          .select()
          .from(artists)
          .where(
            like(sql`lower(${artists.name})`, `%${search.toLowerCase()}%`)
          );

  //GET all artists
  const allArtists =
    search === 1
      ? await db
          .select()
          .from(artists)
          .limit(10)
          .offset((currentPage - 1) * 10)
      : await db
          .select()
          .from(artists)
          .where(like(sql`lower(${artists.name})`, `%${search.toLowerCase()}%`))
          .limit(10)
          .offset((currentPage - 1) * 10);

  const formattedArtists = allArtists.map((artist) => ({
    ...artist,
    createdAt: artist.createdAt.toISOString(),
    updatedAt: artist.updatedAt.toISOString(),
  }));

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <Link
          href="/admin/artists/create"
          className="flex justify-center items-center bg-blue-500 text-white font-bold p-4 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-blue-700"
        >
          Tambah Data Baru
        </Link>

        <div>
          <SearchBar />
        </div>
      </div>
      {formattedArtists.map((artist: Artist) => {
        return <ArtistCard key={artist.id} artist={artist} />;
      })}
      <Pagination dataCount={artistCount.length} />
    </>
  );
}
