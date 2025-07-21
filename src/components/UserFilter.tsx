"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function UserFilter() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filter = searchParams.get("filter") || "all";

  function changeQuery(filter: string) {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("q", query);
    newSearchParams.set("filter", filter);
    return `/search?${newSearchParams.toString()}`;
  }

  return (
    <>
      <Link
        className={`flex justify-center text-white w-20 items-center font-bold p-4 rounded-lg shadow-md hover:cursor-pointer hover:bg-blue-500 ${
          filter === "all" ? `bg-blue-500` : "bg-gray-300"
        } `}
        href={changeQuery("all")}
      >
        All
      </Link>
      <Link
        className={`flex justify-center text-white w-20 items-center font-bold p-4 rounded-lg shadow-md hover:cursor-pointer hover:bg-blue-500 ${
          filter === "albums" ? `bg-blue-500` : "bg-gray-300"
        } `}
        href={changeQuery("albums")}
      >
        Albums
      </Link>
      <Link
        className={`flex justify-center text-white w-20 items-center font-bold p-4 rounded-lg shadow-md hover:cursor-pointer hover:bg-blue-500 ${
          filter === "artists" ? `bg-blue-500` : "bg-gray-300"
        } `}
        href={changeQuery("artists")}
      >
        Artists
      </Link>
      <Link
        className={`flex justify-center text-white w-20 items-center font-bold p-4 rounded-lg shadow-md hover:cursor-pointer hover:bg-blue-500 ${
          filter === "songs" ? `bg-blue-500` : "bg-gray-300"
        } `}
        href={changeQuery("songs")}
      >
        Songs
      </Link>
    </>
  );
}
