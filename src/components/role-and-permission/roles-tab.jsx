'use client';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Tooltip, Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
} from '@heroui/react';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { RoleColumns, RoleData } from '../../utils/dummy-data';
import { useRouter } from 'next/navigation';

const permissionData = [
  { value: 'read', label: 'Read' },
  { value: 'delete', label: 'Delete' },
  { value: 'edit', label: 'Edit' },
]

const RolesTab = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return RoleData;
    return RoleData.filter((role) =>
      role.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item.id}</p>;
      case 'role':
        return <p className="text-sm font-medium capitalize whitespace-nowrap">{item.role}</p>;
      case 'description':
        return <p className="text-sm font-medium capitalize min-w-[10rem]">{item.description}</p>;
      case 'permission':
        return (
          <div className="flex flex-wrap gap-1 min-w-[10rem]">
            {item?.permission?.map((perm, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset"
              >
                {perm}
              </span>
            ))}
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



  return (
    <div className="book-list-section">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end my-4">
        <Input
          isClearable
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search by role..."
          startContent={<SearchIcon />}
          className="w-full sm:max-w-md"
          classNames={{
            label: 'text-sm font-medium text-[#68686F] dark:text-[#9F9FA5]',
            inputWrapper:
              'bg-white dark:bg-black border border-[#E7E7E9] dark:border-[#3E3E3E] rounded-xl px-4 py-2 h-10',
            input: 'text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]',
          }}
        />
        <Button
          type="button"
          color="primary"
          className="bg-gradient-to-r from-purple-700 to-purple-500 text-white"
          endContent={<PlusIcon />}
          onPress={onOpen}
        >
          Add New Role
        </Button>
      </div>

      <Table aria-label="Roles table">
        <TableHeader columns={RoleColumns}>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Role</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1.5">
                  <Input
                    type="text"
                    label="Role Name"
                    placeholder=' '
                    labelPlacement='outside'
                    size='lg'
                    classNames={
                      {
                        label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                        inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                        input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                      }
                    }
                  />
                  <small className='text-red-500 text-sm'></small>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Textarea
                    type="text"
                    label="Description"
                    placeholder=' '
                    labelPlacement='outside'
                    size='lg'
                    classNames={
                      {
                        label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                        inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                        input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                      }
                    }
                  />
                  <small className='text-red-500 text-sm'></small>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <Select
                    items={permissionData}
                    labelPlacement='outside'
                    label="Permission"
                    placeholder="Select a permission"
                    classNames={{
                      label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                      base: "max-w-full",
                      trigger: "!h-[3rem] bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none"
                    }}
                  >
                    {(permission) => <SelectItem key={permission?.value}>{permission.label}</SelectItem>}
                  </Select>
                  <small className='text-red-500 text-sm'></small>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="secondary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RolesTab;
