'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input, Button, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner
} from '@heroui/react';
import { ChevronDownIcon, SearchIcon } from '../../utils/icon';
import { useRouter } from 'next/navigation';
import { getAllMenus, getAllRolesApi, updateMenuAccessApi } from '@/utils/commonapi';

const MenuAccessTab = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState(new Set([]));
  const [menuColumns, setMenuColumns] = useState([]);
  const [data, setData] = useState([]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return menuColumns;
    return menuColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((menu) =>
      menu?.menu?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const handleCheckboxChange = async (menuId, roleName, isChecked) => {
    try {
      setIsUpdating(true);
      let hasAccess = isChecked?.target?.checked
      const updateData = {
        menuId,
        roleName,
        hasAccess
      }
      console.log("🚀 ~ handleCheckboxChange ~ updateData:", updateData)
      // Call the API to update menu access
      const response = await updateMenuAccessApi(updateData);

      if (response) {
        // Update local state to reflect the change
        fetchAllMenus();

        // Optional: Show success message
        console.log('Menu access updated successfully');
      } else {
        console.error('Failed to update menu access:', response.message);
        // Optional: Show error message to user
      }
    } catch (error) {
      console.error('Error updating menu access:', error);
      // Optional: Show error message to user
      // You might want to revert the checkbox state here
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'menu':
        return (
          <p className="text-sm whitespace-nowrap font-medium text-gray-700">
            {item.menu}
          </p>
        );

      default:
        // For roles like super_admin, admin, etc.
        const isChecked = item.permission.includes(Number(columnKey));
        const isAdmin = String(columnKey) === "1" ? true : false;
        return (
         isAdmin ?  <Tooltip content="Super admin have default access for all menus" showArrow={true}>
            <Checkbox
              color='secondary'
              isSelected={isChecked}
              // isDisabled={isUpdating || isAdmin}
              // onChange={(checked) => handleCheckboxChange(item.id, columnKey, checked)}
            />
          </Tooltip> : <Checkbox
              color='secondary'
              isSelected={isChecked}
              isDisabled={isUpdating || isAdmin}
              onChange={(checked) => handleCheckboxChange(item.id, columnKey, checked)}
            />
        );
    }
  }, [isUpdating]);

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  }

  const fetchAllRoles = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRolesApi();
      if (response) {
        const apiData = response?.data;
        // Add default menu item and map role data with renamed keys
        const rolesWithMenuItem = [
          { name: "Menu Items", uid: "menu" }, // default menu item with role_id key
          ...apiData.map(role => ({
            name: role.name,          // renamed from 'name' or 'id' to 'role_id'
            uid: role.id // e.g., "Super Admin" → "super_admin"
          }))
        ];
        const columnsVisible = rolesWithMenuItem?.map((item) => item?.uid);
        setVisibleColumns(columnsVisible);
        setMenuColumns(rolesWithMenuItem || []);
      }
    } catch (error) {
      console.log("🚀 ~ fetchAllRoles ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMenus = async () => {
    try {
      const response = await getAllMenus();
      if (response) {
        setData(response?.data)
      }
    } catch (error) {
      console.log("🚀 ~ fetchAllMenus ~ error:", error)
    }
  }

  // Function to refresh menu data after updates
  const refreshMenuData = async () => {
    await fetchAllMenus();
  };

  useEffect(() => {
    fetchAllRoles();
    fetchAllMenus();
  }, []);

  return (
    <div className="book-list-section">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end my-4">
        <Input
          isClearable
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search by menu..."
          startContent={<SearchIcon />}
          className="w-full sm:max-w-md"
          classNames={{
            label: 'text-sm font-medium text-[#68686F] dark:text-[#9F9FA5]',
            inputWrapper:
              'bg-white dark:bg-black border border-[#E7E7E9] dark:border-[#3E3E3E] rounded-xl px-4 py-2 h-10',
            input: 'text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]',
          }}
        />

        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
              Roles
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={setVisibleColumns}
          >
            {menuColumns
              .filter((column) => column.uid !== "menu") // 👈 filter out "Menu Items"
              .map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <Table aria-label="Roles table">
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column?.uid !== "menu" ? "center" : "start"}
              className='font-semibold text-black dark:text-white'
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredData}
          isLoading={isLoading}
          loadingContent={
            <Spinner color='secondary'/>
          }
          emptyContent={<span className="text-center text-sm text-gray-500">No data found.</span>}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuAccessTab;
