import React from 'react';
import MainLayout from '@/layout-component/main-layout';
import { usePathname } from 'next/navigation';
import BreadcrumbsComponent from '@/layout-component/breadcrumbs';
import MenuAccessTab from '@/components/role-and-permission/menu-access-tab';

const RoleAndPermission = () => {
  const pathname = usePathname();

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);
  return (
    <MainLayout>
      <div className='mb-4'>
        <BreadcrumbsComponent arr={pathSegments} />
      </div>
      <MenuAccessTab />
    </MainLayout>
  );
};

export default RoleAndPermission;
