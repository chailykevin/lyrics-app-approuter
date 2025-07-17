export const dynamic = "force-dynamic";

import AlbumCard from "@/components/AlbumCard";
import { db } from "@/index";
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

export default async function AdminAlbumsPage() {
  //Get all albums

  const responses = await db.query.albums.findMany({
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
      <Link
        href="/admin/albums/create"
        className="bg-white p-4 my-2 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-gray-200"
      >
        Tambah Data Baru
      </Link>
      {allAlbums.map((album: Album) => {
        return <AlbumCard key={album.id} album={album} />;
      })}
    </>
  );
}
