import { useRouter } from "next/router";

const BookUploadEdit = () => {
  const router = useRouter();
  const { id } = router.query; // Get the slug from the URL

  return (
    <div>
      <h1>Blog Post: {id}</h1>
      <p>This is a dynamic blog post page.</p>
    </div>
  );
};

export default BookUploadEdit;
