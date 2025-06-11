"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MainLayout from "../../layout-component/main-layout";
import { Tabs, Tab, Card, CardBody, Input, Button } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/utils/icon";
import { changePassword } from "@/utils/commonapi";
import { toast } from "react-hot-toast";

// Password strength function
const getPasswordStrength = (password) => {
  if (!password) return "";
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=.{8,})/;
  const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[A-Z])(?=.*\d)))(?=.{6,})/;

  if (strongRegex.test(password)) return "strong";
  if (mediumRegex.test(password)) return "medium";
  return "weak";
};

// Yup validation schema
const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/\d/, "Must include at least one number")
    .matches(/[^A-Za-z0-9]/, "Must include at least one special character")
    .notOneOf([yup.ref("currentPassword")], "New password must be different from current password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});


export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serverMessage, setServerMessage] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(newPassword));
  }, [newPassword]);

  const onSubmit = async (data) => {
    setServerMessage(null);
    try {
      const formData = {
        "oldPassword": data?.currentPassword,
        "newPassword": data?.newPassword
      };

      const response = await changePassword(formData);
      if (response) {
        toast.success("Password changed successfully!", {
          position: "top-right",
          duration: 3000,
        });
        reset();
      }
    } catch (err) {
      setServerMessage("Something went wrong.");
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-black dark:text-white mb-6">Settings</h1>

      <Tabs aria-label="Options" variant="bordered">
        <Tab key="security" title="Security">
          <Card className="max-w-md">
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md">
                <div>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    label="Current Password"
                    labelPlacement="outside"
                    placeholder=" "
                    {...register("currentPassword")}
                    isInvalid={!!errors.currentPassword}
                    errorMessage={errors.currentPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                        {showCurrentPassword ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </div>

                <div>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    label="New Password"
                    labelPlacement="outside"
                    placeholder=" "
                    {...register("newPassword")}
                    isInvalid={!!errors.newPassword}
                    errorMessage={errors.newPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={() => setShowNewPassword((prev) => !prev)}>
                        {showNewPassword ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                  {newPassword && (
                    <p className={`mt-1 text-sm ${getStrengthColor(passwordStrength)}`}>
                      Strength: {passwordStrength.toUpperCase()}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm New Password"
                    labelPlacement="outside"
                    placeholder=" "
                    {...register("confirmPassword")}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                        {showConfirmPassword ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </div>

                <Button type="submit" color="secondary" isLoading={isSubmitting}>
                  Change Password
                </Button>

                {serverMessage && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">{serverMessage}</p>
                )}
              </form>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </MainLayout>
  );
}

// Helper function for strength color
function getStrengthColor(level) {
  switch (level) {
    case "weak":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "strong":
      return "text-green-500";
    default:
      return "text-gray-400";
  }
}
