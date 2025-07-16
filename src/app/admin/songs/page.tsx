import SongCard from "@/components/SongCard";
import { db } from "@/index";
import Link from "next/link";

type Song = {
  id: number;
  title: string;
  lyrics: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const AdminSongsPage = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/songs`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const allSongs = await response.json();

  const allSongsX = allSongs.data.map((song: Song) => ({
    ...song,
    createdAt: song.createdAt.toString(),
    updatedAt: song.updatedAt.toString(),
  }));

  return (
    <>
      <Link
        href="/admin/songs/create"
        className="bg-white p-4 my-2 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-gray-200"
      >
        Tambah Data Baru
      </Link>
      {allSongsX.map((song: Song) => {
        return <SongCard key={song.id} song={song} />;
      })}
    </>
  );
};

export default AdminSongsPage;
