"use client"

import UserList from "@/components/user/user-list";
import MainLayout from "../../../layout-component/main-layout";

export default function HomePage() {

  return (
    <>
      <MainLayout>
        <UserList />
      </MainLayout>
    </>
  );
}
