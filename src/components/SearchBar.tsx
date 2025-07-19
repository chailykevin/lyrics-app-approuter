"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const pathname = usePathname();
  const extractedPathname = pathname.split("/")[2];

  function createPageURL() {
    const params = new URLSearchParams();
    params.set("search", search);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex flex-row justify-center items-center gap-2">
      <input
        type="search"
        placeholder={`Search ${extractedPathname}`}
        className="bg-white px-4 py-2 my-2 w-60 rounded-lg shadow-md hover:cursor-text hover:bg-gray-200"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Link
        href={createPageURL()}
        type="submit"
        className="bg-blue-500 text-white font-bold p-3 rounded-lg shadow-md hover:cursor-pointer w-max hover:bg-blue-700"
      >
        <FaSearch />
      </Link>
    </div>
  );
}
