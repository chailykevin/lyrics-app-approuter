import AdminSongForm from "@/components/SongForm";

type AdminSongFormPageProps = {
  params: {
    id: string;
  };
};

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const AdminSongFormPage = async ({ params }: AdminSongFormPageProps) => {
  const { id } = params;

  const response = await fetch(`http://localhost:3000/api/songs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const song = await response.json();
  const songData = song.data;

  const response2 = await fetch("http://localhost:3000/api/artists", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const allArtist = await response2.json();

  const formattedAllArtists = allArtist.data.map((artist: Artist) => ({
    ...artist,
    createdAt: artist.createdAt.toString(),
    updatedAt: artist.updatedAt.toString(),
  }));

  return (
    <AdminSongForm id={id} song={songData} artists={formattedAllArtists} />
  );
};

export default AdminSongFormPage;
