'use client';
import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardBody, CardFooter, Chip, useDisclosure
} from '@heroui/react';
import { getAllMenus, getAllRolesApi, getMenusBasedRoleId, updateMenuAccessApi } from '@/utils/commonapi';
import { useSelector } from 'react-redux';
import { RxHamburgerMenu } from "react-icons/rx";
import { LuPencilLine } from 'react-icons/lu';
import MenuAccessEditPopup from './menu-access-edit-popup';


const MenuAccessTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [editData, setEditData] = useState(null);
  const authSelector = useSelector(state => state?.auth);
  const userRole = authSelector?.userInfo?.roleId;
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

  const fetchAllRoles = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRolesApi();
      if (response) {
        const apiData = response?.data;
        const addWithPermission = await Promise.all(
          apiData.map(async (role) => {
            const permission = await fetchMenuPermission(role?.id);
            return { ...role, permission };
          })
        );
        setRoles(addWithPermission);
      }
    } catch (error) {
      console.log("🚀 ~ fetchAllRoles ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuPermission = async (roleId) => {
    try {
      const response = await getMenusBasedRoleId(roleId);
      if (response) {
        const { data: { menus } } = response;
        return menus;
      }
    } catch (error) {
      console.log("🚀 ~ fetchMenuPermission ~ error:", error)
      return [];
    }
  }

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const openEditPopup = (data) => {
    setEditData(data);
    onOpen();
  }

  const closeEditPopup = () => {
    setEditData(null);
    onClose();
    fetchAllRoles();
  }

  return (
    <div className="book-list-section">
      <div className="flex flex-col gap-6">
        {
          roles && Array.isArray(roles) && roles?.length > 0 && roles?.map((item, index) => (
            <Card key={`card_${index}`}>
              <CardHeader className="gap-2 justify-between">
                <div className='flex flex-col items-start gap-2'>
                  <h1 className="m-0 text-black dark:text-white font-bold text-md">{item?.name}</h1>
                  {/* <p className="m-0 text-slate-600 dark:text-slate-100 text-sm leading-relaxed">Full system access</p> */}
                </div>
                <div className="flex item-center gap-3">
                  <LuPencilLine className='w-5 h-5 cursor-pointer text-black dark:text-white' onClick={() => openEditPopup(item)} />
                </div>
              </CardHeader>
              <CardBody>
                <div className="menu-header flex items-center gap-3 text-slate-700 dark:text-slate-100">
                  <div className="flex items-center gap-2">
                    <RxHamburgerMenu className='w-5 h-5'/>
                    <h6 className="m-0 text-sm font-semibold text-slate-700 dark:text-slate-100">Menu Access</h6>
                    <Chip color='primary' variant='bordered' radius='md'>
                      {item?.permission?.length} menus
                    </Chip>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {item?.permission?.map(menu => (
                      <div key={`menu_${menu.id}`} className="flex items-center gap-2 text-xs bg-neutral-100 dark:bg-neutral-700 rounded-xl p-3">
                          <span className="text-slate-700 dark:text-slate-100 font-medium truncate">{menu.title}</span>
                      </div>
                    ))}
                </div>
              </CardBody>
              {/* <CardFooter>

              </CardFooter> */}
            </Card>
          ))
        }
      </div>
      {
        isOpen && <MenuAccessEditPopup isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} data={editData} afterSubmit={closeEditPopup} />
      }
    </div>
  );
};

export default MenuAccessTab;
