'use client';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input, Button
} from '@heroui/react';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { bookListColumns } from '../../utils/dummy-data';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";
import BookUploadPopup from './book-upload-popup';

const BookList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState('');
  const [isOpenBookUploadPopup, setIsOpenBookUploadPopup] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'book_id':
        return <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item?.book_id}</p>;
      case 'title':
        return <p className="text-sm font-medium capitalize whitespace-nowrap">{item?.title}</p>;
      case 'filename':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.filename}</p>;
      case 'pages':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.filename}</p>;
      case 'chunks':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item?.filename}</p>;
        case "upload_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize whitespace-nowrap">
                {dayjs(item?.upload_date).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
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
        return item[columnKey];
    }
  }, []);

  const handleBookUploadPopup = () => {
    setIsOpenBookUploadPopup(!isOpenBookUploadPopup);
  }

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

      <Table aria-label="Roles table">
        <TableHeader columns={bookListColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column?.uid === "actions" ? "center" : "start"}
              className='font-semibold text-black'
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={[filteredData]}
          emptyContent={<span className="text-center text-sm text-gray-500">No matching roles found.</span>}
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

      {
        isOpenBookUploadPopup && <BookUploadPopup isOpen={isOpenBookUploadPopup} onOpenChange={handleBookUploadPopup}/>
      }
    </div>
  );
};

export default BookList;
