import React from 'react';
import MainLayout from '@/layout-component/main-layout';
import {Tabs, Tab} from "@heroui/react";
import RolesTab from '@/components/role-and-permission/roles-tab';
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

      <Tabs aria-label="Options"
        classNames={{
          tabList: "bg-white",
          cursor: "bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] text-white",
          tabContent: "group-data-[selected=true]:text-white text-black",
        }}
      >
        <Tab key="roles" title="Roles">
          <RolesTab />
        </Tab>
        <Tab key="menu_access" title="Menu Access">
          <MenuAccessTab />
        </Tab>
      </Tabs>
    </MainLayout>
  );
};

export default RoleAndPermission;
