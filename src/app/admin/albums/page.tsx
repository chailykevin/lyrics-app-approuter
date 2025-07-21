export const dynamic = "force-dynamic";

import AlbumCard from "@/components/AlbumCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { albums } from "@/db/schema";
import { db } from "@/index";
import { like, sql } from "drizzle-orm";
import Link from "next/link";

type Album = {
  id: number;
  title: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
  songs: Song[];
};

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Song = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

export default async function AdminAlbumsPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  //Ga boleh ada magic number
  const search = searchParams?.search || 1;

  //Get all albums

  //Bisa ditarik dan dijadiin sebuah function, namanya harus deskriptif (abstraksi)
  const albumCount =
    search === 1
      ? await db.select().from(albums)
      : await db
          .select()
          .from(albums)
          .where(
            like(sql`lower(${albums.title})`, `%${search.toLowerCase()}%`)
          );

  //Bisa ditarik dan dijadiin sebuah function, namanya harus deskriptif (abstraksi)
  //Nama variabel harus jelas banget
  const responses =
    search === 1
      ? await db.query.albums.findMany({
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
          limit: 10,
          offset: (currentPage - 1) * 10,
        })
      : await db.query.albums.findMany({
          where: like(sql`lower(${albums.title})`, `%${search.toLowerCase()}%`),
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
          limit: 10,
          offset: (currentPage - 1) * 10,
        });

  //Bisa ditarik dan dijadiin sebuah function, namanya harus deskriptif (abstraksi)
  const allAlbums = responses.map((response) => ({
    id: response.id,
    title: response.title,
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
      <div className="flex flex-row justify-between items-center">
        <Link
          href="/admin/albums/create"
          className="flex justify-center items-center bg-blue-500 text-white font-bold p-4 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-blue-700"
        >
          Tambah Data Baru
        </Link>

        <div>
          <SearchBar />
        </div>
      </div>
      {allAlbums.map((album: Album) => {
        return <AlbumCard key={album.id} album={album} />;
      })}
      <Pagination dataCount={albumCount.length} />
    </>
  );
}
