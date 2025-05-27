'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Spinner,
} from '@heroui/react';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon } from '../../utils/icon';
import { RoleColumns } from '../../utils/dummy-data';
import { useRouter } from 'next/navigation';
import { getAllRolesApi, createRoleApi } from '@/utils/commonapi';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';

// Validation schema
const roleSchema = yup.object().shape({
  name: yup
    .string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .trim()
});

const RolesTab = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [rolesData, setRolesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: ''
    }
  });

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rolesData;
    return rolesData.filter((role) =>
      role.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, rolesData]);

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{item.id}</p>;
      case 'name':
        return <p className="text-sm font-medium capitalize whitespace-nowrap">{item.name}</p>;
      default:
        return item[columnKey];
    }
  }, []);

  const fetchAllRoles = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRolesApi();
      if (response) {
        setRolesData(response?.data || []);
      }
    } catch (error) {
      console.log("🚀 ~ fetchAllRoles ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    try {
      const response = await createRoleApi(data);

      if (response) {
        await fetchAllRoles();
        reset();
        onClose();
        console.log('Role created successfully:', response);
        toast.success("Role created successfully", {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      const errorMessage =
      error?.response?.data?.error || // backend-defined error
      error?.message ||               // generic JS error
      "Something went wrong. Please try again."; // fallback

      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
      });
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };

  const handleModalClose = () => {
    reset();
    onOpenChange(false);
  };

  useEffect(() => {
    fetchAllRoles();
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
              align={"center"}
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
          emptyContent={
            <span className="text-center text-sm text-gray-500">
              No matching roles found.
            </span>
          }
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

      <Modal isOpen={isOpen}
        isDismissable={!isSubmitting}
        isKeyboardDismissDisabled={isSubmitting}
        onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(handleCreateRole)}>
              <ModalHeader className="flex flex-col gap-1">Add Role</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1.5">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        label="Role Name"
                        placeholder="Enter role name"
                        labelPlacement='outside'
                        size='lg'
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        classNames={{
                          label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                          inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                          input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]",
                          errorMessage: "text-red-500 text-sm mt-1"
                        }}
                      />
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleModalClose}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-gradient-to-r from-purple-700 to-purple-500 text-white"
                >
                  {isSubmitting ? 'Creating...' : 'Create Role'}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RolesTab;
