import UserAlbumCard from "@/components/UserAlbumCard";
import UserArtistCard from "@/components/UserArtistCard";
import UserFilter from "@/components/UserFilter";
import UserSongCard from "@/components/UserSongCard";
import { albums, artists, songs } from "@/db/schema";
import { db } from "@/index";
import { desc, like, sql } from "drizzle-orm";

export default async function UserSearchPage(props: {
  searchParams?: Promise<{
    q?: string;
    filter?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const filter = searchParams?.filter || "all";

  //Get data semua dan query
  //Get data album
  const responses =
    query === ""
      ? filter === "all"
        ? await db.query.albums.findMany({
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
          })
        : await db.query.albums.findMany({
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
          })
      : filter === "all"
      ? await db.query.albums.findMany({
          where: like(sql`lower(${albums.title})`, `%${query.toLowerCase()}%`),
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
        })
      : await db.query.albums.findMany({
          where: like(sql`lower(${albums.title})`, `%${query.toLowerCase()}%`),
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

  //Get data artist
  const responses2 =
    query === ""
      ? filter === "all"
        ? await db.select().from(artists).limit(5)
        : await db.select().from(artists)
      : filter === "all"
      ? await db
          .select()
          .from(artists)
          // .where(like(sql`lower(${artists.name})`, `%${query.toLowerCase()}%`))
          .where(like(artists.name, query))
          .limit(5)
      : await db
          .select()
          .from(artists)
          // .where(like(sql`lower(${artists.name})`, `%${query.toLowerCase()}%`));
          .where(like(artists.name, query));
  const allArtists = responses2.map((response) => ({
    ...response,
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString(),
  }));

  //Get data song
  const responses3 =
    query === ""
      ? filter === "all"
        ? await db.query.songs.findMany({
            with: {
              artist_song: {
                with: {
                  artist: true,
                },
              },
            },
            limit: 5,
          })
        : await db.query.songs.findMany({
            with: {
              artist_song: {
                with: {
                  artist: true,
                },
              },
            },
          })
      : filter === "all"
      ? await db.query.songs.findMany({
          where: like(sql`lower(${songs.title})`, `%${query.toLowerCase()}%`),
          with: {
            artist_song: {
              with: {
                artist: true,
              },
            },
          },
          limit: 5,
        })
      : await db.query.songs.findMany({
          where: like(sql`lower(${songs.title})`, `%${query.toLowerCase()}%`),
          with: {
            artist_song: {
              with: {
                artist: true,
              },
            },
          },
        });

  const allSongs = responses3.map((response) => ({
    id: response.id,
    title: response.title,
    lyrics: response.lyrics,
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString(),
    artists: response.artist_song.map((link) => ({
      ...link.artist,
      createdAt: link.artist.createdAt.toISOString(),
      updatedAt: link.artist.updatedAt.toISOString(),
    })), // <--- Perbaiki nama properti di sini
  }));

  return (
    <main className="w-full min-h-full flex-flex-col mt-4 px-40 py-4">
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="font-bold text-4xl">&quot;{query}&quot;</h2>
        <p>{filter.toUpperCase()} RESULTS</p>

        <div className="flex self-start gap-1">
          <UserFilter />
        </div>

        <div className="flex flex-col gap-2 self-start">
          {/* Albums */}
          {filter === "all" && (
            <h3 className="text-xl font-bold justify-start">Albums</h3>
          )}
          <div className="flex flex-row gap-4">
            {filter === "all" || filter === "albums"
              ? allAlbums.map((album) => (
                  <UserAlbumCard key={album.id} album={album} />
                ))
              : ""}
          </div>
        </div>

        {/* Songs */}
        <div className="flex flex-col gap-2 self-start w-full">
          {filter === "all" && (
            <h3 className="text-xl font-bold justify-start">Songs</h3>
          )}
          <div className="flex flex-col gap-2">
            {filter === "all" || filter === "songs"
              ? allSongs.map((song) => (
                  <UserSongCard
                    key={song.id}
                    songName={song.title}
                    songId={song.id}
                    createdAt={song.createdAt}
                    songArtists={song.artists}
                  />
                ))
              : ""}
          </div>
        </div>

        {/* Artists */}
        <div className="flex flex-col gap-2 self-start w-full">
          {filter === "all" && (
            <h3 className="text-xl font-bold justify-start">Artists</h3>
          )}
          <div className="flex flex-col gap-2">
            {filter === "all" || filter === "artists"
              ? allArtists.map((artist) => (
                  <UserArtistCard key={artist.id} artist={artist} />
                ))
              : ""}
          </div>
        </div>
      </div>
    </main>
  );
}
