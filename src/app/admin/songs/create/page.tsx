import AdminSongForm from "@/components/SongForm";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const AdminNewSongPage = async () => {
  const response = await fetch("http://localhost:3000/api/artists", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const allArtist = await response.json();

  const formattedArtists = allArtist.data.map((artist: Artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  return <AdminSongForm artists={formattedArtists} />;
};

export default AdminNewSongPage;
