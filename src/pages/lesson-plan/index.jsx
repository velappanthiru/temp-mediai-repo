"use client"

import MainLayout from "../../layout-component/main-layout";

export default function HomePage() {

  return (
    <>
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-600 dark:text-white">Coming Soon</h1>
            <p className="text-gray-500 dark:text-white mt-2">We're working on something amazing. Stay tuned!</p>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
