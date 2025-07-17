export const dynamic = "force-dynamic";

import AdminSongForm from "@/components/SongForm";
import { artists } from "@/db/schema";
import { db } from "@/index";

export default async function AdminNewSongPage() {
  //GET all artists

  const allArtists = await db.select().from(artists);

  const formattedArtists = allArtists.map((artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  return <AdminSongForm artists={formattedArtists} />;
}
