import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";
import { toast } from "sonner";
import { isLoggedIn } from "../../../utils/auth";
import NotFound from "../../NotFound";
import { Helmet } from "react-helmet-async";
import { UploadSingleFile } from "../../../utils/FileHandling";
import {
  Card,
  CardHeader,
  Badge,
  Button,
  Avatar,
  CardBody,
  Input,
  DatePicker,
  Textarea,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { IconPencil } from "@tabler/icons-react";
import { parseDate } from "@internationalized/date";

const User = () => {
  const navigate = useNavigate();
  const { user } = isLoggedIn();
  const [file, setFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAccountModal = useDisclosure();

  if (user?.role !== "admin") {
    return (
      <div className="my-24" onLoad={() => {}}>
        <NotFound message="You are not allowed to access this page" />
      </div>
    );
  }
  const { id }: any = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/admin/user/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      formik.setValues(data);
      if (data.dob == 0) {
        formik.setFieldValue("dob", "2000-01-01");
      }
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      email: "",
      photo: "",
      bio: "",
      role: "",
      gender: "",
      dob: "2000-01-01",
      phone: "",
      address: "",
      confirmemail: "",
      isDoctor: false,
      previewPhoto: "",
    },
    onSubmit: async (values) => {
      try {
        if (file) {
          const filename = `profile-${values.email}-${Date.now()}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.photo = filename;
        }
        const response = await axios.put(
          `${API_BASE_URL}/api/admin/user/${id}`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(response.data.message);
        navigate("/dashboard/users");
      } catch (error: any) {
        console.log(error.message);
        toast.error(error.message);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewPhoto: imageData,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      toast.success(`${formik.values.name} was deleted successfully`);
      navigate("/dashboard/users");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Manage {`${formik.values.name}`} - Shailung Polyclinic</title>
        <meta
          name="description"
          content={`Manage ${formik.values.name}'s information on Shailung Polyclinic in Itahari, Nepal`}
        />
        <meta
          name="keywords"
          content="Shailung Polyclinic, Shailung, Polyclinic, Hospital, Clinic, Health, Health Care, Medical, Medical Care, Itahari, Nepal, User, User Information, User Details, User Profile, User Profile Information, User Profile Details, User Profile Information Details, User Profile Information Details Page, User Profile Information Details Page of Shailung Polyclinic, User Profile Information Details Page of Shailung Polyclinic in Itahari, User Profile Information Details Page of Shailung Polyclinic in Itahari, Nepal, Shailung Polyclinic User Profile Information Details Page, Shailung Polyclinic User Profile Information Details Page in Itahari, Shailung Polyclinic User Profile Information Details Page in Itahari, Nepal"
        />
        <link
          rel="canonical"
          href={`https://report.shailungpolyclinic.com/admin/user/${id}/edit`}
        />
      </Helmet>

      <Card className="w-full p-2">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Account Details</p>
          <div className="flex gap-4 py-4">
            <input
              id="photo"
              name="photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
            />
            <Badge
              classNames={{
                badge: "w-5 h-5",
              }}
              color="primary"
              content={
                <Button
                  isIconOnly
                  className="p-0 text-primary-foreground"
                  radius="full"
                  size="sm"
                  variant="light"
                  as={"label"}
                  htmlFor="photo"
                >
                  <IconPencil size={12} />
                </Button>
              }
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                className="h-14 w-14"
                src={
                  formik.values.previewPhoto
                    ? formik.values.previewPhoto
                    : `${API_BASE_URL}/api/upload/single/${formik.values.photo}`
                }
              />
            </Badge>
            <div className="flex flex-col items-start justify-center">
              <p className="font-medium">{formik.values.name}</p>
              <span className="text-small text-default-500">
                {formik.values.email}
              </span>
            </div>
          </div>
          <p className="text-small text-default-400">
            The photo will be used for your profile, and will be visible to
            other users of the platform.
          </p>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
          />
          <Input
            label="Email"
            placeholder="Enter email"
            value={formik.values.email}
            onChange={formik.handleChange}
            name="email"
          />
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            name="phone"
          />

          <Input
            label="Address"
            placeholder="Enter address"
            value={formik.values.address}
            onChange={formik.handleChange}
            name="address"
          />
          <DatePicker
            label="Date of Birth"
            onChange={(date) => {
              formik.setFieldValue("dob", date.toString().split("T")[0]);
            }}
            value={parseDate(formik.values.dob)}
            name="dob"
            showMonthAndYearPickers
          />
          <Textarea
            label="Bio"
            placeholder="Write a few sentences bio yourself."
            value={formik.values.bio}
            onChange={formik.handleChange}
            name="bio"
            className="col-span-full"
          />
        </CardBody>
        <CardFooter className="mt-4 justify-between gap-2">
          <Button
            variant="light"
            onClick={deleteAccountModal.onOpenChange}
            // disabled={isDeleting}
            // isLoading={isDeleting}
            color="danger"
          >
            Delete Account
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      {/* <Security /> */}
      <div className="divider my-12"></div>
      {<Security id={id} />}
      <Modal
        isOpen={deleteAccountModal.isOpen}
        onOpenChange={deleteAccountModal.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <p>Delete Your Account</p>
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="confirmemail"
                  onChange={formik.handleChange}
                  value={formik.values.confirmemail}
                  placeholder={formik.values.email}
                  label={`Enter ${formik.values.email} to delete`}
                  isRequired
                />
              </ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button
                  color="default"
                  fullWidth
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  isDisabled={
                    formik.values.confirmemail !== formik.values.email ||
                    isDeleting
                  }
                  isLoading={isDeleting}
                  onPress={() => {
                    handleDelete();
                  }}
                >
                  Delete Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

interface SecurityProps {
  id: string;
}

const Security = ({ id }: SecurityProps) => {
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    onSubmit: async (values) => {
      try {
        const res = await axios.put(
          `${API_BASE_URL}/api/admin/user/reset-password/${id}`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(res.data.message);
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    validate: (values) => {
      const errors: any = {};
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      } else if (values.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters long";
      }
      return errors;
    },
  });

  return (
    <>
      <Card className="w-full p-2">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Security Settings</p>

          <p className="text-small text-default-400">
            Manage your security preferences
          </p>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4">
          <Input
            id="new_password"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            name="newPassword"
            isRequired
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            isInvalid={
              formik.errors.newPassword && formik.touched.newPassword
                ? true
                : false
            }
            errorMessage={formik.errors.newPassword}
          />

          <Input
            id="confirm_password"
            label="Confirm Password"
            placeholder="Confirm your password"
            name="confirmPassword"
            type="password"
            isRequired
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            isInvalid={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? true
                : false
            }
            errorMessage={formik.errors.confirmPassword}
          />
        </CardBody>
        <CardFooter className="mt-4 justify-end">
          <Button
            color="primary"
            variant="flat"
            type="submit"
            onPress={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
            isDisabled={
              formik.errors.confirmPassword || formik.errors.newPassword
                ? true
                : false || formik.isSubmitting
            }
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default User;
