import * as yup from "yup";

export const bookSchema = yup.object().shape({
  book_name: yup.string().required("Book name is required").max(255, "Book name is too long"),
  author_name: yup.string().required("Author name is required").max(100, "Author name is too long"),
  year: yup
    .string()
    .required("Year is required"),
  edition: yup.string().required("Edition is required").max(50, "Edition is too long"),
  pdf_file: yup.mixed().required("PDF file is required"), // You may validate file types separately
  is_publish: yup.string().required("Publish date is required"),
  publisher_name: yup.string().required("Publisher name is required").max(255, "Publisher name is too long"),
});

