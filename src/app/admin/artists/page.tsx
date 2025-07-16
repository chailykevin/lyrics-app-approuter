import ArtistCard from "@/components/ArtistCard";
import Link from "next/link";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const AdminArtistsPage = async () => {
  const response = await fetch("http://localhost:3000/api/artists", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const allArtist = await response.json();

  const allArtistsX = allArtist.data.map((artist: Artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  return (
    <>
      <Link
        href="/admin/artists/create"
        className="bg-white p-4 my-2 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-gray-200"
      >
        Tambah Data Baru
      </Link>
      {allArtistsX.map((artist: Artist) => {
        return <ArtistCard key={artist.id} artist={artist} />;
      })}
    </>
  );
};

export default AdminArtistsPage;
