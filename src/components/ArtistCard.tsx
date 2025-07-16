"use client";

import Link from "next/link";
import { FaTrash } from "react-icons/fa6";

// 1. Definisikan tipe untuk objek Artist
type Artist = {
  id: number | string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 2. Definisikan tipe untuk Props. Komponen ini menerima SATU prop bernama 'artist'
type ArtistCardProps = {
  artist: Artist;
};

// 3. Gunakan destructuring { artist } untuk mengambil objek dari props
const ArtistCard = ({ artist }: ArtistCardProps) => {
  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:3000/api/artists/${artist.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      alert("Data berhasil dihapus");
    } else {
      alert("Data gagal dihapus");
    }
    return;
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white p-4 my-2 rounded-lg shadow-md hover:bg-gray-200 hover:cursor-pointer">
      <Link href={`/admin/artists/${artist.id}/edit`}>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{artist.name}</h2>
          <p className="text-sm text-gray-500">
            Created at: {new Date(artist.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>
      </Link>
      <FaTrash onClick={handleDelete} />
    </div>
  );
};

export default ArtistCard;
