export const dynamic = "force-dynamic";

import UserSongCard from "@/components/UserSongCard";
import { db } from "..";
import UserAlbumCard from "@/components/UserAlbumCard";
import { albums } from "@/db/schema";
import { desc } from "drizzle-orm";

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

  //Get Data Album
  const responses = await db.query.albums.findMany({
    limit: 4,
    orderBy: [desc(albums.createdAt)],
    with: {
      album_artist: {
        with: {
          artist: true,
        },
      },
      album_song: {
        with: {
          song: {
            with: {
              artist_song: {
                with: {
                  artist: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const allAlbums = responses.map((response) => ({
    id: response.id,
    title: response.title,
    coverImagePath: response.coverImagePath,
    releaseDate: response.releaseDate.toISOString(),
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString(),
    artists: response.album_artist.map((link) => ({
      ...link.artist,
      createdAt: link.artist.createdAt.toISOString(),
      updatedAt: link.artist.updatedAt.toISOString(),
    })),
    songs: response.album_song.map((link) => ({
      ...link.song,
      createdAt: link.song.createdAt.toISOString(),
      updatedAt: link.song.updatedAt.toISOString(),
      artists: link.song.artist_song.map((link) => ({
        ...link.artist,
        createdAt: link.artist.createdAt.toISOString(),
        updatedAt: link.artist.updatedAt.toISOString(),
      })),
    })),
  }));

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-40">
        <section className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">Discover Song Lyrics</h1>
          <p>
            Explore thousands of song lyrics from your favorite artists. Clean,
            readable, and distraction-free.
          </p>
        </section>
        <section className="flex flex-col self-start w-full">
          <h2 className="text-xl font-bold mb-4">Recently Added Albums</h2>
          <div className="flex flex-row justify-center gap-6">
            {[...allAlbums].map((album) => {
              // Bikin card untuk album
              return <UserAlbumCard key={album.id} album={album} />;
            })}
          </div>
        </section>
        <section className="flex flex-col self-start w-full">
          <h2 className="text-xl font-bold mb-4">Recently Added Song</h2>
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
