'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input, Button
} from '@heroui/react';
import { EditIcon, EyeIcon, SearchIcon } from '../../utils/icon';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layout-component/main-layout';
import { activeExamsApi } from '@/utils/commonapi';
import dayjs from "dayjs";

const examListColumns = [
  { name: "ID", uid: "id" },
  { name: "Exam Name", uid: "exam_name" },
  { name: "Book Name", uid: "book_name" },
  { name: "Date", uid: "date" },
  { name: "Duration", uid: "duration" },
  { name: "Total Questions", uid: "total_questions" },
  { name: "Marks per Question", uid: "marks_per_question" },
  { name: "Total Marks", uid: "total_marks" },
  { name: "Actions", uid: "actions" },
];


const ExamList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const renderCell = useCallback((item, columnKey) => {

    switch (columnKey) {

      case 'exam_name':
        return <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item?.exam_name}</p>;

      case 'book_name':
        return <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item?.book_name}</p>;

      case 'date':
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium whitespace-nowrap">
              {dayjs(item?.date).format("DD MMM YYYY")}
            </p>
          </div>
        );

      case 'duration':
        return <p className="text-sm font-medium whitespace-nowrap">{item?.duration} hours</p>;

      case 'total_questions':
        return <p className="text-sm font-medium whitespace-nowrap">{item?.total_questions}</p>;

      case 'marks_per_question':
        return <p className="text-sm font-medium whitespace-nowrap">{item?.marks_per_question}</p>;

      case 'total_marks':
        return <p className="text-sm font-medium whitespace-nowrap">{item?.total_marks}</p>;

        case 'actions':
          const isToday = dayjs(item.date).isSame(dayjs(), 'day');
          return (
            <div className="flex justify-center gap-2">
              <Button
                color="secondary"
                size="sm"
                radius="full"
                isDisabled={!isToday}
                onPress={() => isToday && router.push(`/online-exam/${item.id}`)}
              >
                Take Test
              </Button>
            </div>
          );

      default:
        return item[columnKey];
    }
  }, []);

  const fetchExamsApi = async () => {
    try {
      const response = await activeExamsApi();
      if (response) {
        setData(response?.data?.exams)
      }
    } catch (error) {
      console.log("🚀 ~ fetchExamsApi ~ error:", error);
    }
  }

  useEffect(() => {
    fetchExamsApi();
  }, [])
  return (
    <MainLayout>
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
        </div>

        <Table aria-label="Roles table">
          <TableHeader columns={examListColumns}>
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
            items={filteredData}
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
      </div>
    </MainLayout>
  );
};

export default ExamList;
