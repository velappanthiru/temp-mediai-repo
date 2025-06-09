"use client"
import Link from "next/link";

import PatientDetailsAdd from "../../components/patient-details/patient-details-upload";
import MainLayout from "../../layout-component/main-layout";

export default function HomePage() {

  return (
    <>
      <MainLayout>
      <PatientDetailsAdd />
      </MainLayout>
    </>
  );
}
