import { songs } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default async function UserDetailSong({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //GET one song
  const { id } = await params;
  const songId = Number(id);

  if (isNaN(songId)) {
    throw new Error("ID Lagu harus berupa angka");
  }

  const song = await db.query.songs.findFirst({
    where: eq(songs.id, songId),
    with: {
      artist_song: {
        with: {
          artist: true,
        },
      },
    },
  });

  if (!song) {
    return <p>Lagu tidak ditemukan</p>;
  }

  const formattedSong = {
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
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full gap-6 py-4 px-20">
        <section className="w-full flex flex-col justify-center items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">{formattedSong.title}</h1>
            <p className="">
              {formattedSong.artists
                .map((artist: Artist) => artist.name)
                .join(", ")}
            </p>
          </div>
          <pre className="p-4 w-1/2 border-2 whitespace-pre-wrap break-words overflow-x-auto">
            {formattedSong.lyrics}
          </pre>
        </section>
      </main>
    </>
  );
}
