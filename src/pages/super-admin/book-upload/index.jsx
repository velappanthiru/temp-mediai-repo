"use client"
import Link from "next/link";

import BookList from "../../../components/book-upload/book-list";
import MainLayout from "../../../layout-component/main-layout";

export default function HomePage() {

  return (
    <>
      <MainLayout>
      <BookList />
      </MainLayout>
    </>
  );
}
