// components/AdminSongForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react"; // Import useEffect
import Link from "next/link"; // Import Link untuk tombol kembali

// --- Type Definitions (pastikan ini konsisten di seluruh aplikasi Anda) ---
type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Song = {
  id: number;
  title: string;
  lyrics: string | null; // Pastikan lirik bisa null
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
};

// Modifikasi props agar 'song' dan 'id' menjadi opsional
type AdminSongFormProps = {
  song?: Song; // Opsional: data lagu jika dalam mode edit
  id?: string; // Opsional: ID lagu jika dalam mode edit
  artists: Artist[]; // Wajib: daftar semua artis untuk dropdown
};
// --- End Type Definitions ---

const AdminSongForm = ({ song, id, artists }: AdminSongFormProps) => {
  // Inisialisasi state berdasarkan props 'song' atau nilai default
  const [title, setTitle] = useState(song?.title || ""); // Jika song ada, pakai title-nya, kalau tidak pakai string kosong
  const [lyrics, setLyrics] = useState(song?.lyrics || ""); // Jika song ada, pakai lyrics-nya, kalau tidak pakai string kosong
  const [selectedArtistsId, setSelectedArtistsId] = useState<number[]>(
    song?.artists.map((artist) => artist.id) || [] // Jika song ada, mapping artist IDs, kalau tidak array kosong
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading tombol submit
  const router = useRouter();

  // Gunakan useEffect untuk update state jika props 'song' berubah
  // Ini penting jika komponen dirender ulang dengan data lagu yang berbeda
  useEffect(() => {
    setTitle(song?.title || "");
    setLyrics(song?.lyrics || "");
    setSelectedArtistsId(song?.artists.map((artist) => artist.id) || []);
  }, [song]); // Dependensi pada objek song

  const handleArtistChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;
    const selectedIds = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => Number(option.value));
    setSelectedArtistsId(selectedIds);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state

    // Tentukan method dan URL API berdasarkan keberadaan 'id'
    const method = id ? "PUT" : "POST"; // PUT untuk edit, POST untuk tambah baru
    const url = id ? `/api/songs/${id}` : "/api/songs"; // URL API sesuai method

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            lyrics: lyrics,
            artistIds: selectedArtistsId,
          }),
        }
      );

      if (response.ok) {
        alert(`Lagu berhasil ${id ? "diubah" : "ditambahkan"}!`);
        router.push("/admin/songs"); // Redirect ke daftar lagu
        router.refresh(); // Memaksa re-fetch data di halaman daftar
      } else {
        const errorData = await response.json();
        alert(
          `Gagal ${id ? "mengubah" : "menambahkan"}: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  // Tentukan teks untuk judul form dan tombol submit
  const formTitle = id ? "Edit Lagu" : "Tambah Lagu Baru";
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
          Judul Lagu
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Contoh: Sang Juara"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>

      <div>
        <label
          htmlFor="lyrics"
          className="block text-sm font-medium text-gray-700"
        >
          Lirik lagu
        </label>
        <textarea
          rows={10} // Mengurangi tinggi default
          id="lyrics"
          name="lyrics"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Masukkan lirik lagu"
          onChange={(e) => setLyrics(e.target.value)}
          value={lyrics}
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
          value={selectedArtistsId.map(String)} // value untuk multiple select harus array of strings
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-40 overflow-y-auto"
        >
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isSubmitting} // Nonaktifkan tombol saat submit
      >
        {isSubmitting ? "Memproses..." : submitButtonText}
      </button>

      <Link
        href="/admin/songs"
        className="block text-center text-blue-600 hover:underline mt-4"
      >
        Kembali ke Daftar Lagu
      </Link>
    </form>
  );
};

export default AdminSongForm;
