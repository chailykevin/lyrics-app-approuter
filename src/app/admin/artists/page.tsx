export const dynamic = "force-dynamic";

import ArtistCard from "@/components/ArtistCard";
import Pagination from "@/components/Pagination";
import { artists } from "@/db/schema";
import { db } from "@/index";
import Link from "next/link";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default async function AdminArtistsPage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const artistCount = await db.select().from(artists);

  //GET all artists
  const allArtists = await db
    .select()
    .from(artists)
    .limit(10)
    .offset((currentPage - 1) * 10);

  const formattedArtists = allArtists.map((artist) => ({
    ...artist,
    createdAt: artist.createdAt.toISOString(),
    updatedAt: artist.updatedAt.toISOString(),
  }));

  return (
    <>
      <Link
        href="/admin/artists/create"
        className="bg-white p-4 my-2 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-gray-200"
      >
        Tambah Data Baru
      </Link>
      {formattedArtists.map((artist: Artist) => {
        return <ArtistCard key={artist.id} artist={artist} />;
      })}
      <Pagination dataCount={artistCount.length} />
    </>
  );
}
