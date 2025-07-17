"use client";

import { addAlbum } from "@/app/actions/album";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type AdminAlbumFormProps = {
  album?: Album;
  id?: number;
  artists: Artist[];
  songs: Song[];
};

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

export default function AdminAlbumForm({
  album,
  id,
  artists,
  songs,
}: AdminAlbumFormProps) {
  const [title, setTitle] = useState(album?.title || "");
  const [releaseDate, setReleaseDate] = useState(album?.releaseDate || "");
  const [selectedArtistsId, setSelectedArtistsId] = useState<number[]>(
    album?.artists.map((artist) => artist.id) || []
  );
  const [selectedSongsId, setSelectedSongsId] = useState<number[]>(
    album?.songs.map((song) => song.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTitle(album?.title || "");
    setReleaseDate(album?.releaseDate || "");
    setSelectedArtistsId(album?.artists.map((artist) => artist.id) || []);
    setSelectedSongsId(album?.songs.map((song) => song.id) || []);
  }, [album]);

  function handleArtistChange(event: ChangeEvent<HTMLSelectElement>) {
    const { options } = event.target;
    const selectedIds = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => Number(option.value));
    setSelectedArtistsId(selectedIds);
  }

  function handleSongChange(event: ChangeEvent<HTMLSelectElement>) {
    const { options } = event.target;
    const selectedIds = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => Number(option.value));
    setSelectedSongsId(selectedIds);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //Server action POST dan PUT
    event.preventDefault();

    setIsSubmitting(true);

    const response = await addAlbum(new FormData(event.currentTarget));

    if (response === "Sukses") {
      alert(`Album berhasil ${id ? "diubah" : "ditambahkan"}!`);
      router.push("/admin/albums");
      router.refresh();
    } else {
      alert(`Gagal ${id ? "mengubah" : "menambahkan"} album`);
    }

    setIsSubmitting(false);
  }

  const formTitle = id ? "Edit Album" : "Tambah Album Baru";
  const submitButtonText = id ? "Simpan Perubahan" : "Tambah Lagu";

  return (
    <form
      className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {formTitle}
      </h2>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Judul Album
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Contoh: BALLADS 1"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>

      <div>
        <label
          htmlFor="releaseDate"
          className="block text-sm font-medium text-gray-700"
        >
          Tanggal Rilis
        </label>
        <input
          id="releaseDate"
          name="releaseDate"
          type="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Masukkan tanggal rilis album"
          onChange={(e) => setReleaseDate(e.target.value)}
          value={releaseDate}
        />
      </div>

      <div>
        <label
          htmlFor="artists"
          className="block text-sm font-medium text-gray-700"
        >
          Pilih Artis (Tekan Ctrl/Cmd untuk memilih banyak)
        </label>
        <select
          multiple
          name="artists"
          id="artists"
          onChange={handleArtistChange}
          value={selectedArtistsId.map(String)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-40 overflow-y-auto"
        >
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="songs"
          className="block text-sm font-medium text-gray-700"
        >
          Pilih Lagu (Tekan Ctrl/Cmd untuk memilih banyak)
        </label>
        <select
          multiple
          name="songs"
          id="songs"
          onChange={handleSongChange}
          value={selectedSongsId.map(String)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-40 overflow-y-auto"
        >
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Memproses..." : submitButtonText}
      </button>

      <Link
        href="/admin/albums"
        className="block text-center text-blue-600 hover:underline mt-4"
      >
        Kembali ke Daftar Album
      </Link>
    </form>
  );
}
