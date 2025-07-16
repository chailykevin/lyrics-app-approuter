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

// Modifikasi props agar 'artist' dan 'id' menjadi opsional
type AdminArtistFormProps = {
  id?: string; // Opsional: ID lagu jika dalam mode edit
  artist?: Artist; // Wajib: daftar semua artis untuk dropdown
};
// --- End Type Definitions ---

const AdminArtistForm = ({ id, artist }: AdminArtistFormProps) => {
  // Inisialisasi state berdasarkan props 'artist' atau nilai default
  const [name, setName] = useState(artist?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading tombol submit
  const router = useRouter();

  // Gunakan useEffect untuk update state jika props 'artist' berubah
  // Ini penting jika komponen dirender ulang dengan data lagu yang berbeda
  useEffect(() => {
    setName(artist?.name || "");
  }, [artist]); // Dependensi pada objek artist

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state

    // Tentukan method dan URL API berdasarkan keberadaan 'id'
    const method = id ? "PUT" : "POST"; // PUT untuk edit, POST untuk tambah baru
    const url = id ? `/api/artists/${id}` : "/api/artists"; // URL API sesuai method

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
          }),
        }
      );

      if (response.ok) {
        alert(`Artist berhasil ${id ? "diubah" : "ditambahkan"}!`);
        router.push("/admin/artists"); // Redirect ke daftar lagu
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
  const formTitle = id ? "Edit Artist" : "Tambah Artist Baru";
  const submitButtonText = id ? "Simpan Perubahan" : "Tambah Artist";

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
          Nama Artist
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Contoh: Sang Juara"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isSubmitting} // Nonaktifkan tombol saat submit
      >
        {isSubmitting ? "Memproses..." : submitButtonText}
      </button>

      <Link
        href="/admin/artists"
        className="block text-center text-blue-600 hover:underline mt-4"
      >
        Kembali ke Daftar Artist
      </Link>
    </form>
  );
};

export default AdminArtistForm;
