'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card, CardHeader, CardBody, CardFooter, Chip, useDisclosure, Table, TableHeader, TableBody, TableRow, TableCell, Button, Input, Spinner, Tooltip, TableColumn, Pagination
} from '@heroui/react';
import { getAllMenus, getAllRolesApi, getMenusBasedRoleId, updateMenuAccessApi } from '@/utils/commonapi';
import { useSelector } from 'react-redux';
import { RxHamburgerMenu } from "react-icons/rx";
import { LuPencilLine } from 'react-icons/lu';
import MenuAccessPopup from './menu-access-popup';
import { SearchIcon } from '@/layout-component/chatbox-header';
import { EditIcon, EyeIcon, PlusIcon } from '@/utils/icon';
import CreateRoleWithMenu from './create-role-and-menu';

const headerListColumns = [
  { name: "S.no", uid: "id" },
  { name: "Role Name", uid: "name" },
  { name: "Menus", uid: "permission" },
  { name: "ACTIONS", uid: "actions" },
];

const MenuAccessTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const authSelector = useSelector(state => state?.auth);
  const userRole = authSelector?.userInfo?.roleId;
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const { isOpen: createRoleIsOpen, onOpen: createRoleOnOpen, onClose: createRoleOnClose, onOpenChange: createRoleOnChange } = useDisclosure();
  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  // First filter the data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, roles]);

  // Then paginate the filtered data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData]);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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

  const submitCreateRole = () => {
    createRoleOnClose();
    fetchAllRoles();
  }

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return <p className="text-sm font-medium capitalize">{item?.id}</p>;
      case 'name':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.name}</p>;
      case 'permission':
        return (
          <div className='min-w-[15rem]'>
            {item?.permission?.length > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.permission.map(p => p.title).join(', ')}
              </p>
            ) : (
              <span className="text-sm text-gray-400 italic">No menus assigned</span>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className="flex justify-center gap-2">
            {/* <Tooltip content="View Details">
              <Button
                isIconOnly
                variant="light"
                onPress={() => console.log(`View ${item?.id}`)}
              >
                <EyeIcon className="w-4 h-4 text-primary" />
              </Button>
            </Tooltip> */}
            <Tooltip content="Edit Role">
              <Button
                isIconOnly
                variant="light"
                onPress={() => openEditPopup(item)}
              >
                <EditIcon className="w-4 h-4 text-gray-500" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
    }
  }, []);

  return (
    <div className="book-list-section">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end my-4">
        <Input
          isClearable
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search by role name..."
          startContent={<SearchIcon />}
          className="w-full sm:max-w-md"
          classNames={{
            label: 'text-sm font-medium text-[#68686F] dark:text-[#9F9FA5]',
            inputWrapper:
              'bg-white dark:bg-black border border-[#E7E7E9] dark:border-[#3E3E3E] rounded-xl px-4 py-2 h-10',
            input: 'text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]',
          }}
        />

        <Button color="primary" size="sm" className="bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)]" endContent={<PlusIcon />} onPress={createRoleOnOpen}>
          Add New Role
        </Button>
      </div>
      <Table aria-label="Books table">
        <TableHeader columns={headerListColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column?.uid === "actions" ? "center" : "start"}
              className='font-semibold text-black dark:text-white'
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={paginatedData}
          isLoading={isLoading}
          loadingContent={<Spinner color='secondary' />}
          emptyContent={<span className="text-center text-sm text-gray-500">No roles found.</span>}
        >
          {(item) => (
            <TableRow key={item.book_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Move pagination outside of TableBody and show only when there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex w-full justify-center mt-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
      {
        isOpen && <MenuAccessPopup isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} data={editData} afterSubmit={closeEditPopup} />
      }
      {
        createRoleIsOpen && <CreateRoleWithMenu isOpen={createRoleIsOpen} onOpenChange={createRoleOnChange} onClose={submitCreateRole} />
      }
    </div>
  );
};

export default MenuAccessTab;
