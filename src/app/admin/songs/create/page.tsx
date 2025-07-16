import AdminSongForm from "@/components/SongForm";
import environment from "@/config/environment";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const AdminNewSongPage = async () => {
  const response = await fetch(
    `${environment.NEXT_PUBLIC_BASE_URL}/api/artists`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const allArtist = await response.json();

  const formattedArtists = allArtist.data.map((artist: Artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  return <AdminSongForm artists={formattedArtists} />;
};

export default AdminNewSongPage;
