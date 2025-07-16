import AdminArtistForm from "@/components/ArtistForm";
import environment from "@/config/environment";

type AdminArtistFormPageProps = {
  params: {
    id: string;
  };
};

const AdminArtistFormPage = async ({ params }: AdminArtistFormPageProps) => {
  const { id } = params;

  const response = await fetch(
    `$${environment.NEXT_PUBLIC_BASE_URL}/api/artists/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const artist = await response.json();

  console.log(artist);

  return <AdminArtistForm artist={artist.data} id={id} />;
};

export default AdminArtistFormPage;
