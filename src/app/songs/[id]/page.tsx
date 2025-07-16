import environment from "@/config/environment";

type UserDetailSongProps = {
  params: {
    id: string;
  };
};

type Artist = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const UserDetailSong = async ({ params }: UserDetailSongProps) => {
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

  const songResponse = await response.json();
  const song = songResponse.data;

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-20">
        <section className="w-full flex flex-col justify-center items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">{song.title}</h1>
            <p className="">
              {song.artists.map((artist: Artist) => artist.name)}
            </p>
          </div>
          <pre className="p-4 w-1/2 border-2 whitespace-pre-wrap break-words overflow-x-auto">
            {song.lyrics}
          </pre>
        </section>
      </main>
    </>
  );
};

export default UserDetailSong;
