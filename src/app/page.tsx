export const dynamic = "force-dynamic";

import UserSongCard from "@/components/UserSongCard";
import { db } from "..";

export default async function Home() {
  //GET all songs

  const allSongs = await db.query.songs.findMany({
    with: {
      artist_song: {
        with: {
          artist: true,
        },
      },
    },
  });

  const allSongsFormatted = allSongs.map((song) => ({
    id: song.id,
    title: song.title,
    lyrics: song.lyrics,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString(),
    artists: song.artist_song.map((link) => ({
      ...link.artist,
      createdAt: link.artist.createdAt.toISOString(),
      updatedAt: link.artist.updatedAt.toISOString(),
    })),
  }));

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-20">
        <section className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">Discover Song Lyrics</h1>
          <p>
            Explore thousands of song lyrics from your favorite artists. Clean,
            readable, and distraction-free.
          </p>
        </section>
        <section className="flex flex-col self-start w-full">
          <h2 className="text-xl font-bold mb-2">Recently Added</h2>
          <div className="flex flex-col gap-2">
            {[...allSongsFormatted].reverse().map((song) => {
              return (
                <UserSongCard
                  key={song.id}
                  songId={song.id}
                  songName={song.title}
                  songArtists={song.artists}
                  createdAt={song.createdAt}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
