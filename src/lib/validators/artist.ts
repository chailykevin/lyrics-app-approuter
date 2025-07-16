import * as yup from "yup";

export const artistSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Nama artis harus memiliki minimal 2 karakter")
    .required("Nama artis harus diisi"),
});
