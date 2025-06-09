'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input, Button, Pagination, Spinner
} from '@heroui/react';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { bookListColumns } from '../../utils/dummy-data';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";
import BookUploadPopup from './book-upload-popup';
import { bookTopicsandTitleApi } from '@/utils/commonapi';

const BookList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenBookUploadPopup, setIsOpenBookUploadPopup] = useState(false);
  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  // First filter the data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

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

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'title':
        return <p className="text-sm font-medium capitalize min-w-[20rem] max-w-[20rem]">{item?.title}</p>;
      case 'collection_name':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.collection_name}</p>;
      case 'pages':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.pages}</p>;

      case "upload_date":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize whitespace-nowrap">
              {dayjs(item?.upload_date).format("DD MMM YYYY")}
            </p>
          </div>
        );

      // case 'actions':
      //   return (
      //     <div className="flex justify-center gap-2">
      //       <Tooltip content="View Details">
      //         <Button
      //           isIconOnly
      //           variant="light"
      //           onPress={() => console.log(`View ${item?.id}`)}
      //         >
      //           <EyeIcon className="w-4 h-4 text-primary" />
      //         </Button>
      //       </Tooltip>
      //       <Tooltip content="Edit Role">
      //         <Button
      //           isIconOnly
      //           variant="light"
      //           onPress={() => console.log(`Edit ${item?.id}`)}
      //         >
      //           <EditIcon className="w-4 h-4 text-gray-500" />
      //         </Button>
      //       </Tooltip>
      //     </div>
      //   );
      default:
        return item[columnKey];
    }
  }, []);

  const handleBookUploadPopup = () => {
    setIsOpenBookUploadPopup(!isOpenBookUploadPopup);
  }

  const fetchBookTopicsandTitle = async () => {
    setIsLoading(true);
    try {
      const response = await bookTopicsandTitleApi();
      if (response?.data) {
        setData([]);
      }
    } catch (error) {
      console.log("🚀 ~ fetchBookTopicsandTitle ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookTopicsandTitle();
  }, [])

  return (
    <div className="book-list-section">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end my-4">
        <Input
          isClearable
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search by book name..."
          startContent={<SearchIcon />}
          className="w-full sm:max-w-md"
          classNames={{
            label: 'text-sm font-medium text-[#68686F] dark:text-[#9F9FA5]',
            inputWrapper:
              'bg-white dark:bg-black border border-[#E7E7E9] dark:border-[#3E3E3E] rounded-xl px-4 py-2 h-10',
            input: 'text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]',
          }}
        />

        <Button color="primary" size="sm" className="bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)]" endContent={<PlusIcon />} onPress={handleBookUploadPopup}>
          Book Upload
        </Button>
      </div>

      <Table aria-label="Books table">
        <TableHeader columns={bookListColumns}>
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
          emptyContent={<span className="text-center text-sm text-gray-500">No matching books found.</span>}
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

      {/* Debug info - remove in production */}
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Total items: {filteredData.length}, Current page: {page}, Total pages: {totalPages}
      </div>

      {
        isOpenBookUploadPopup && <BookUploadPopup isOpen={isOpenBookUploadPopup} onOpenChange={handleBookUploadPopup}/>
      }
    </div>
  );
};

export default BookList;
