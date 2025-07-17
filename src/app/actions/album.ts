"use server";

import { albums } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function deleteAlbum(formData: FormData) {
  const rawFormData = {
    id: Number(formData.get("albumId")),
  };

  if (!rawFormData.id || isNaN(rawFormData.id)) {
    notFound();
  }

  const deletedAlbum = await db
    .delete(albums)
    .where(eq(albums.id, rawFormData.id));

  if (deletedAlbum[0].affectedRows === 0) {
    return "Gagal";
  } else {
    return "Berhasil";
  }
}
