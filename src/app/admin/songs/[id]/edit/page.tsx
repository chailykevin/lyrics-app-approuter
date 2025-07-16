import AdminSongForm from "@/components/SongForm";
import environment from "@/config/environment";

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

  const response = await fetch(
    `${environment.NEXT_PUBLIC_BASE_URL}/api/songs/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const song = await response.json();
  const songData = song.data;

  const response2 = await fetch(
    `${environment.NEXT_PUBLIC_BASE_URL}/api/artists`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

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
