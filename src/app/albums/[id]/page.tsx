import UserSongCard from "@/components/UserSongCard";
import { albums } from "@/db/schema";
import { db } from "@/index";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserDetailAlbum({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = Number(id);

  if (isNaN(albumId)) {
    notFound();
  }

  const response = await db.query.albums.findFirst({
    where: eq(albums.id, albumId),
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

  if (!response) {
    notFound();
  }

  const album = {
    id: response.id,
    title: response.title,
    coverImagePath: response.coverImagePath,
    releaseDate: format(
      new Date(response.releaseDate.toISOString()),
      "yyyy-MM-dd"
    ),
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
  };

  return (
    <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-120">
      <div className="flex gap-4 w-full">
        {/* Image */}
        <div className="flex grow-0 min-w-60 h-60 border-1 rounded-md">
          <Image
            src={`/albumCover${album.coverImagePath}`}
            alt={`${album.title} Album Cover`}
            width={240}
            height={240}
          />
        </div>
        {/* Details */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-1">
            <p className="text-blue-300 font-medium">ALBUM</p>
            <h2 className="text-4xl font-bold">{album.title}</h2>
            <p className="text-lg">
              {album.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p>Released: {album.releaseDate}</p>
            <p>
              {album.songs.length === 1
                ? album.songs.length + " track"
                : album.songs.length + " tracks"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h3>Track List</h3>
        {album.songs.map((song) => {
          return (
            <UserSongCard
              key={song.id}
              songId={song.id}
              songName={song.title}
              createdAt={song.createdAt}
              songArtists={song.artists}
            />
          );
        })}
      </div>
    </main>
  );
}
