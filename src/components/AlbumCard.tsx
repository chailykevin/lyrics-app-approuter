"use client";

import Link from "next/link";
import { FaTrash } from "react-icons/fa6";
import { deleteAlbum } from "@/app/actions/album";
import { useRouter } from "next/navigation";

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
};

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    //IMPLEMENTASI SERVER ACTION
    const confirmDelete = confirm("Yakin ingin menghapus album ini?");
    if (!confirmDelete) return;

    const formData = new FormData();
    formData.append("albumId", String(album.id));
    const message = await deleteAlbum(formData);
    if (message === "Berhasil") {
      alert("Album berhasil dihapus");
      router.refresh();
    } else {
      alert("Album gagal dihapus");
    }
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white p-4 my-2 rounded-lg shadow-md hover:bg-gray-200 hover:cursor-pointer">
      <Link href={`/admin/albums/${album.id}/edit`}>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{album.title}</h2>
          <p className="text-sm text-gray-500">
            Created at: {new Date(album.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>
      </Link>
      <FaTrash onClick={handleDelete} />
    </div>
  );
}
