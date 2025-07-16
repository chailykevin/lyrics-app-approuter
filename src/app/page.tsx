import UserSongCard from "@/components/UserSongCard";
import environment from "@/config/environment";

type Song = {
  id: string;
  title: string;
  lyrics: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

type Artist = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const Home = async () => {
  const response = await fetch(
    `${environment.NEXT_PUBLIC_BASE_URL}/api/songs`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const allSongs = await response.json();

  const formattedSongs = allSongs.data.map((song: Song) => ({
    ...song,
    createdAt: song.createdAt.toString(),
    updatedAt: song.updatedAt.toString(),
  }));

  console.log(formattedSongs);

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-20">
        <section className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">Discover Song Lyrics</h1>
          <p className="">
            Explore thousands of song lyrics from your favorite artists. Clean,
            readable, and distraction-free.
          </p>
        </section>
        <section className="flex flex-col self-start w-full">
          <h2 className="text-xl font-bold mb-2">Recently Added</h2>
          <div className="flex flex-col gap-2">
            {[...formattedSongs].reverse().map((song) => {
              return (
                <UserSongCard
                  key={song.id}
                  songId={song.id}
                  songName={song.title}
                  songArtists={song.artist}
                  createdAt={song.createdAt}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
