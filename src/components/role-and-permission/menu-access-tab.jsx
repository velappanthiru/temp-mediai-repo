'use client';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input, Button, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from '@heroui/react';
import { ChevronDownIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { useRouter } from 'next/navigation';

const INITIAL_VISIBLE_COLUMNS = ["menu", "super_admin", "admin", "user", "staff", "friends"];

const MenuAccessTab = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [menuColumns, setMenuColumns] = useState([
    { name: "Menu Items", uid: "menu" },
    { name: "Super Admin", uid: "super_admin" },
    { name: "Admin", uid: "admin" },
    { name: "User", uid: "user" },
    { name: "Staff", uid: "staff" },
    { name: "Friends", uid: "friends" },
  ]);
  const [data, setData] = useState([
    {
      id: 1,
      key: "chat_bot",
      menu: "Chat bot",
      permission: ["super_admin", "admin", "user", "staff", "friends"],
    },
    {
      id: 2,
      key: "book_list",
      menu: "Book List",
      permission: ["super_admin", "admin"],
    },
    {
      id: 3,
      key: "user",
      menu: "User",
      permission: ["super_admin", "admin"],
    },
    {
      id: 4,
      key: "online_exam",
      menu: "Online Exam",
      permission: ["super_admin", "admin", "user"],
    },
    {
      id: 5,
      key: "lesson_plan",
      menu: "Lesson Plan",
      permission: ["super_admin", "admin", "user"],
    },
    {
      id: 6,
      key: "reports",
      menu: "Reports",
      permission: ["super_admin", "admin"],
    },
    {
      id: 7,
      key: "role_and_permission",
      menu: "Role and Permission",
      permission: ["super_admin"],
    },
  ]);


  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return menuColumns;

    return menuColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((menu) =>
      menu?.menu?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'menu':
        return (
          <p className="text-sm whitespace-nowrap font-medium text-gray-700">
            {item.menu}
          </p>
        );

      case 'actions':
        return (
          <div className="flex justify-center gap-2">
            <Tooltip content="View Details">
              <Button
                isIconOnly
                variant="light"
                onPress={() => console.log(`View ${item.id}`)}
              >
                <EyeIcon className="w-4 h-4 text-primary" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Role">
              <Button
                isIconOnly
                variant="light"
                onPress={() => console.log(`Edit ${item.id}`)}
              >
                <EditIcon className="w-4 h-4 text-gray-500" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        // For roles like super_admin, admin, etc.
        return (
          <Checkbox color='secondary' isSelected={item.permission.includes(columnKey)} />
        );
    }
  }, []);

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  }

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
