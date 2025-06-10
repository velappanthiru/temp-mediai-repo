import React, { useEffect, useState } from 'react'
import {
   Modal, ModalContent, ModalHeader, Input, ModalFooter, Button, ModalBody, Select, SelectItem
} from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { accessMenusBasedRoleId, createRoleApi, getAllMenus } from '@/utils/commonapi';
import { toast } from 'react-hot-toast';

const roleSchema = yup.object().shape({
  name: yup
    .string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .trim(),
  permission: yup
    .array()
    .min(1, 'At least one menu permission is required')
});

const CreateRoleWithMenu = ({isOpen, onOpenChange, onClose}) => {
  const [menus, setMenus] = useState([]);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: "",
      permission: [],
    }
  });

  const fetchMenus = async () => {
    try {
      const response = await getAllMenus();
      if (response) {
        setMenus(response?.data?.data || [])
      }
    } catch (error) {
      console.log("🚀 ~ fetchMenus ~ error:", error)
      setMenus([]); // Set empty array on error
    }
  }

  const handleFormSubmit = async (formData) => {
    console.log("🚀 ~ handleFormSubmit ~ formData:", formData);
    try {
      const roleData = {
        name: formData?.name,
      };

      const roleResponse = await createRoleApi(roleData);

      if (roleResponse?.data?.data?.id) {
        const roleId = roleResponse.data.data.id;
        const menuIds = (formData?.permission || []).map(Number);

        const accessData = {
          menuIds,
        };

        const accessResponse = await accessMenusBasedRoleId(roleId, accessData);

        if (accessResponse) {
          console.log("🚀 ~ handleFormSubmit ~ accessResponse:", accessResponse);
          onClose();
        }
      } else {
        throw new Error("Failed to create role.");
      }

    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
      });

      console.error("🚀 ~ handleFormSubmit ~ error:", error);
    }
  };



  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        isDismissable={!isSubmitting}
        isKeyboardDismissDisabled={isSubmitting}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
              Add Role
              </ModalHeader>
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
                <div className="flex flex-col gap-1.5">
                  <Controller
                    name="permission"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label="Menu Access"
                        labelPlacement='outside'
                        placeholder="Select Menus"
                        selectionMode='multiple'
                        selectedKeys={new Set(value || [])}
                        onSelectionChange={(keys) => {
                          const selectedArray = Array.from(keys);
                          onChange(selectedArray);
                        }}
                        isInvalid={!!errors.permission}
                        errorMessage={errors.permission?.message}
                        classNames={{
                          label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5] group-data-[filled=true]:text-[#000] group-data-[filled=true]:dark:text-[#9F9FA5] mb-2",
                          base: "max-w-full",
                          trigger: "px-3 py-2 h-12 border border-[#E7E7E9] dark:border-[#3E3E3E] bg-transparent data-[hover=true]:bg-transparent shadow-none rounded-xl",
                          errorMessage: "text-red-500 text-sm mt-1"
                        }}
                      >
                        {menus.map((menu) => (
                          <SelectItem key={menu.id.toString()} value={menu.id.toString()}>
                            {menu.title}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={isSubmitting}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-gradient-to-r from-purple-700 to-purple-500 text-white"
                >
                  {isSubmitting ? "Creating..." : "Create Role"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateRoleWithMenu;
