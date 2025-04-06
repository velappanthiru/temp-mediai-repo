import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Input, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Spinner, Pagination, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ChevronDownIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { bookListColumns } from '../../utils/dummy-data';
import { usePathname, useRouter } from 'next/navigation';
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { bookGetApi } from '@/utils/commonapi';
import { toast } from 'react-hot-toast';
import BookEditPopup from './book-edit';
import BookUploadPopup from './book-upload-popup';

const statusColorMap = {
  true: "success",
  false: "danger",
};

export function Productcapitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = ["id", "bookName", "authorName", "year", "publisher", "edition", "isActive", "actions"];

export const statusOptions = [
  {name: "Active", uid: true},
  {name: "In Active", uid: false},
];

const BookList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [bookData, setBookData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpenBookUploadPopup, setIsOpenBookUploadPopup] = useState(false);
  const [bookSingleData, setBookSingleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isOpenEditModal, setIsOpenEditModal] = React.useState(false);

  const pages = Math.ceil(bookData.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return bookListColumns;

    return bookListColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredBooks = [...bookData];

    if (hasSearchFilter) {
      filteredBooks = filteredBooks.filter((book) =>
        book.bookName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredBooks = filteredBooks.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredBooks;
  }, [bookData, filterValue, statusFilter, hasSearchFilter]);

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

  const handleViewModal = (data) => {
    onViewModalOpen();
    setBookSingleData(data);
  }
  const handleEditModal = (data) => {
    setIsOpenEditModal(!isOpenEditModal);
    setBookSingleData(data);
  }
  const handleOnEditModal = (data) => {
    setIsOpenEditModal(!isOpenEditModal);
  }

  const handleBookUploadPopup = () => {
    setIsOpenBookUploadPopup(!isOpenBookUploadPopup);
  }

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.id}</p>
          </div>
        );
      case "bookName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.bookName}</p>
          </div>
        );
      case "authorName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.authorName}</p>
          </div>
        );
      case "year":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.year}</p>
          </div>
        );
      case "publisher":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.publisher}</p>
          </div>
        );
      case "edition":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">{item?.edition}</p>
          </div>
        );
      case "isActive":
        return (
          <Chip className="capitalize" color={statusColorMap[item.isActive]} size="sm" variant="flat">
            {item?.isActive !== false ? "Active" : "In Active"}
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
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={()=>handleEditModal(item)}>
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


  const handleGetBookData = async () => {
    setIsLoading(true)
    try {
      const response = await bookGetApi();
      if (response) {
        const { data: { books } } = response;
        setBookData(books);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("🚀 ~ handleGetBookData ~ error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetBookData();
  }, [])
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
            placeholder="Search by book name..."
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
                {bookListColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {Productcapitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Button color="primary" size="sm" className="bg-black dark:bg-gray-600" endContent={<PlusIcon />} onPress={() => router.push('/super-admin/book-upload/add')}>
              Add New
            </Button> */}
            <Button color="primary" size="sm" className="bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)]" endContent={<PlusIcon />} onPress={handleBookUploadPopup}>
              AI Agent
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">

          <span className="text-default-400 text-small">Total {bookData.length} books</span>
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
              <option value="25">25</option>
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
    bookData.length,
    // hasSearchFilter,
  ]);


  const bottomContent = React.useMemo(() => {
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


  const handleDownload = async (fileName, fileUrl) => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Set dynamic file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup URL object
      window.URL.revokeObjectURL(url);
      toast.success("Book download successfully.", {
        duration: 4000,
        position: 'top-right',
      })
      setIsDownloading(false);

      onViewModalClose();

    } catch (error) {
      console.error("Download failed", error);
      setIsDownloading(false);
      toast.error("Something went wrong. Please try again.", {
        duration: 4000,
        position: 'top-right',
      })
      onViewModalClose();
    }
  };

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
            emptyContent="No book to display"
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
              <ModalHeader className="flex flex-col gap-1">Book Details</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <p className='m-0 text-base text-black dark:text-white'><strong>Author:</strong> {bookSingleData?.bookName}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Author:</strong> {bookSingleData?.authorName}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Year:</strong> {bookSingleData?.year}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Publisher:</strong> {bookSingleData?.publisher}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Edition:</strong> {bookSingleData?.edition}</p>
                  <p className='m-0 text-base text-black dark:text-white'><strong>Status:</strong> {bookSingleData?.isActive !== false ? "Active" : "In Active"}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onViewModalClose}>
                  Close
                </Button>
                <Button color="primary"
                  className='bg-black text-white'
                  isLoading={isDownloading}
                  onPress={() => handleDownload(`${bookSingleData?.bookName}.pdf`, `${bookSingleData?.bookFile}`)}
                >
                  {isDownloading ? "Downloading..." : "Download Book"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {
        isOpenEditModal && <BookEditPopup isEditModalOpen={isOpenEditModal} onEditOpenChange={handleOnEditModal} onEditModalClose={handleOnEditModal} data={bookSingleData} bookDetailsApi={handleGetBookData} />
      }
      {
        isOpenBookUploadPopup && <BookUploadPopup isOpen={isOpenBookUploadPopup} onOpenChange={handleBookUploadPopup}/>
      }

    </>
  )
}

export default BookList;
