import * as yup from "yup";

export const songSchema = yup.object({
  title: yup.string().required(),
  lyrics: yup.string().required(),
  artistIds: yup
    .array()
    .of(yup.string())
    .min(1, "Lagu harus memiliki minimal 1 artis")
    .required(),
});
