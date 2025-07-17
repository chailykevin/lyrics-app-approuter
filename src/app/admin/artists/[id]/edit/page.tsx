import AdminArtistForm from "@/components/ArtistForm";
import { artists } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function AdminArtistFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //GET one artis
  const { id } = await params;
  const artistId = Number(id);

  const artist = await db
    .select()
    .from(artists)
    .where(eq(artists.id, artistId));

  if (!artist || artist.length === 0) {
    notFound();
  }

  const formattedArtist = {
    ...artist[0],
    createdAt: artist[0].createdAt.toISOString(),
    updatedAt: artist[0].updatedAt.toISOString(),
  };

  return <AdminArtistForm artist={formattedArtist} id={id} />;
}
