import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Input, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Pagination, Spinner, useDisclosure , Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@heroui/react";
import { ChevronDownIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { userListColumns } from '../../utils/dummy-data';
import { usePathname, useRouter } from 'next/navigation';
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { getAllUsers } from '@/utils/commonapi';
import { format } from 'date-fns';


const statusColorMap = {
  active: "success",
  inactive: "danger",
};
export function Productcapitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = ["id", "username", "mobilenum", "emailid", "createdAt", "isActive", "actions"];

export const statusOptions = [
  {name: "Active", uid: true},
  {name: "In Active", uid: false},
];

const UserList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setuserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSingleData, setUserSingleData] = useState(null);

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [sortDescriptor, setSortDescriptor] = React.useState(
    {
      column: "id",
      direction: "ascending",
    }
  );

  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onOpenChange:onViewOpenChange, onClose: onViewModalClose } = useDisclosure();

  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(userData?.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return userListColumns;

    return userListColumns?.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...userData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((book) =>
        book.username.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [userData, filterValue, statusFilter, hasSearchFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.id}</p>
          </div>
        );
      case "username":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.username}</p>
          </div>
        );
      case "mobilenum":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.mobilenum}</p>
          </div>
        );
      case "emailid":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.emailid}</p>
          </div>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{format(new Date(item?.createdAt), "dd-MM-yyyy")}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
            {item?.status !== false ? "Active" : "In Active"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={()=>handleViewModal(item)}>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);


  const handleGetuserData = async () => {
    setIsLoading(true)
    try {
      const response = await getAllUsers();
      if (response) {
        const { data : {data} } = response;
        setuserData(data);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("🚀 ~ handleGetuserData ~ error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetuserData();
  }, [])

  const handleViewModal = (data) => {
    console.log(data,"data");
    onViewModalOpen();
    setUserSingleData(data);
  }
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by username..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown placement="bottom-end">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  {
                    statusFilter === "all"
                    ? "All"
                    : statusFilter.has("true")
                    ? "Active"
                    : statusFilter.has("false")
                    ? "In Active"
                    : statusFilter
                  }
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {Productcapitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
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
                {userListColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {Productcapitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" size="sm" className="bg-black dark:bg-gray-600" endContent={<PlusIcon />} onPress={() => router.push('/super-admin/user/add')}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">

          <span className="text-default-400 text-small">Total {userData.length} Users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    rowsPerPage,
    userData.length,
    // hasSearchFilter,
  ]);


  const bottomContent = React.useMemo(() => {
    console.log(pages,page);
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages ? pages : 1}
          variant="bordered"
          onChange={setPage}
        />
        {/* <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span> */}
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <div className='book-list-section'>
        <BreadcrumbsComponent arr={pathSegments} />
        <Table
          isCompact
          // removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper: "after:bg-foreground after:text-background text-background",
            },
          }}
          className='mt-8'
          selectedKeys={selectedKeys}
          // selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            emptyContent="No user to display"
            items={sortedItems}
            loadingContent={
            <Spinner
              classNames={
                {
                  circle1 : "!border-b-[#7E41A2]",
                  circle2 : "!border-b-[#7E41A2]",
                }
              }
              label="Loading..." />
            }
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isViewModalOpen}
        onOpenChange={onViewOpenChange}
        backdrop='blur'
        size='md'
      >
        <ModalContent>
          {(onViewModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">User Details</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <p className='m-0 text-base text-black dark:text-white'><strong>User Name:</strong> {userSingleData?.username}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Phone:</strong> {userSingleData?.mobilenum}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Email:</strong> {userSingleData?.emailid}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Create At:</strong> {format(new Date(userSingleData?.createdAt), "dd-MM-yyyy")}</p>

                  {/* <p className='m-0 text-base text-black dark:text-white'><strong>Status:</strong> {bookSingleData?.isActive !== false ? "Active" : "In Active"}</p> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onViewModalClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default UserList;
