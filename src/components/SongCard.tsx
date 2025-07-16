"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Song = {
  id: number;
  title: string;
  lyrics: string;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

type SongCardProps = {
  song: Song;
};

const SongCard = ({ song }: SongCardProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    alert(song.id);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/songs/${song.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      alert("Data berhasil dihapus");
      router.refresh();
    } else {
      alert("Data gagal dihapus");
    }
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white p-4 my-2 rounded-lg shadow-md hover:bg-gray-200 hover:cursor-pointer">
      <Link href={`/admin/songs/${song.id}/edit`}>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{song.title}</h2>
          <p className="text-sm text-gray-500">
            Created at: {new Date(song.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>
      </Link>
      <FaTrash onClick={handleDelete} />
    </div>
  );
};

export default SongCard;
