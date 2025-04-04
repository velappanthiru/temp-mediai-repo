"use client"

import MainLayout from "../../../layout-component/main-layout";
import BookMappingList from "../../../components/book-mapping/book-mapping-list";


export default function HomePage() {

  return (
    <>
      <MainLayout>
        <BookMappingList />
      </MainLayout>
    </>
  );
}
