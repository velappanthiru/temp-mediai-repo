import { useRouter } from "next/router";

const BookMappingEdit = () => {
  const router = useRouter();
  const { slug } = router.query; // Get the slug from the URL

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
      <p>This is a dynamic blog post page.</p>
    </div>
  );
};

export default BookMappingEdit;
