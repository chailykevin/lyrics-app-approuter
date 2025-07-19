"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type PaginationProps = {
  dataCount: number;
};

export default function Pagination({ dataCount }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(dataCount / 10);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-row justify-center gap-1 mt-4">
      <Link
        className="flex justify-center items-center border-1 p-2 hover:bg-gray-300 transition cursor-pointer w-12 h-12"
        href={currentPage === 1 ? "" : createPageURL(currentPage - 1)}
      >
        <ArrowLeft></ArrowLeft>
      </Link>
      {Array.from({ length: pageCount }).map((count, index) => (
        <Link
          key={index + 1}
          className={`flex justify-center items-center border-1 p-2 hover:bg-gray-300 transition cursor-pointer w-12 h-12 ${
            currentPage === index + 1
              ? "bg-blue-500 text-white border-black"
              : ""
          }`}
          href={createPageURL(index + 1)}
        >
          <p className="font-bold">{index + 1}</p>
        </Link>
      ))}
      <Link
        className="flex justify-center items-center border-1 p-2 hover:bg-gray-300 transition cursor-pointer w-12 h-12"
        href={currentPage === pageCount ? "" : createPageURL(currentPage + 1)}
      >
        <ArrowRight></ArrowRight>
      </Link>
    </div>
  );
}

function ArrowLeft() {
  return (
    <>
      <FaArrowLeft />
    </>
  );
}

function ArrowRight() {
  return (
    <>
      <FaArrowRight />
    </>
  );
}
