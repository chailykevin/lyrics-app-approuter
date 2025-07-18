import { format } from "date-fns";
import Link from "next/link";

type Album = {
  id: number;
  title: string;
  releaseDate: string;
  artists: Artist[];
  songs: Song[];
  createdAt: string;
  updatedAt: string;
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

type UserAlbumCardProps = {
  album: Album;
};

export default function UserAlbumCard({ album }: UserAlbumCardProps) {
  return (
    <div className="border-1 rounded-sm p-4 max-w-max">
      {/* Untuk Gambar  */}
      <div className="w-60 h-60"></div>
      <h3 className="text-xl font-bold">{album.title}</h3>
      <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
      <div className="flex flex-row">
        <p>{String(format(new Date(album.releaseDate), "yyyy"))}</p>
        <p>
          {" "}
          -
          {album.songs.length === 1
            ? album.songs.length + " track"
            : album.songs.length + " tracks"}{" "}
        </p>
      </div>
      <Link
        href={`/albums/${album.id}`}
        className="flex justify-center items-center bg-green-300 font-semibold p-2 mt-2 rounded-md hover:bg-green-400 transition"
      >
        View Album
      </Link>
    </div>
  );
}
