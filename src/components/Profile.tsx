import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useFormik } from "formik";
import { API_BASE_URL } from "../utils/config";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { UploadSingleFile, DeleteFile } from "../utils/FileHandling";
import { getLoggedUser } from "../functions/get";
import { deleteSelf } from "../functions/delete";
import { Helmet } from "react-helmet-async";

import {
  Card,
  CardHeader,
  Badge,
  Button,
  Avatar,
  CardBody,
  Input,
  CardFooter,
  DatePicker,
  Textarea,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IconPencil } from "@tabler/icons-react";
import { parseDate } from "@internationalized/date";
import { data } from "../utils/data";

const Profile = () => {
  const navigate = useNavigate();
  const { loggedIn } = isLoggedIn();
  // const [user, setUser] = useState<User>({} as User);
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [forgotProcessing, setForgotProcessing] = useState(false);
  const deleteAccountModal = useDisclosure();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      address: "",
      photo: "profile-default.webp",
      previewPhoto: "",
      dob: "2000-01-01",
      password: "",
      confirmemail: "",
    },
    onSubmit: async (values) => {
      try {
        if (file) {
          await DeleteFile(values.photo);
          const filename = `profile-${values.email}-${Date.now()}.${
            file.name.split(".").pop() || "jpg"
          }`;
          await UploadSingleFile(file, filename);
          values.photo = filename;
        }
        const res = await axios.put(
          `${API_BASE_URL}/api/user/profile`,
          values,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(res.data.message);
        fetchUser();
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    // fetch user data
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const res = await getLoggedUser();
      formik.setValues({
        ...formik.values,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        bio: res.data.bio,
        address: res.data.address,
        photo: res.data.photo,
        dob: res.data.dob == 0 ? "2000-01-01" : res.data.dob,
        password: res.data.password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSelf().then(() => {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        navigate("/auth/login");
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

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

  const forgotPassword = async () => {
    setForgotProcessing(true);
    try {
      await axios
        .post(`${API_BASE_URL}/api/user/forgot-password`, {
          id: formik.values.email,
        })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    setForgotProcessing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - {data.title}</title>
      </Helmet>

      <div className="col-span-full lg:col-span-9 max-w-6xl mx-auto my-24 px-8 space-y-8">
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
              labelPlacement="outside"
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
            />
            <Input
              label="Email"
              labelPlacement="outside"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
            />
            <Input
              label="Phone Number"
              labelPlacement="outside"
              placeholder="Enter phone number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              name="phone"
            />

            <Input
              label="Address"
              labelPlacement="outside"
              placeholder="Enter address"
              value={formik.values.address}
              onChange={formik.handleChange}
              name="address"
            />
            <DatePicker
              label="Date of Birth"
              labelPlacement="outside"
              onChange={(date) => {
                formik.setFieldValue("dob", date.toString().split("T")[0]);
              }}
              value={parseDate(formik.values.dob)}
              name="dob"
              showMonthAndYearPickers
            />
            <Textarea
              label="Bio"
              labelPlacement="outside"
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
              disabled={isDeleting}
              isLoading={isDeleting}
              color="danger"
            >
              Delete Account
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="light"
                onClick={forgotPassword}
                disabled={forgotProcessing}
                isLoading={forgotProcessing}
              >
                {formik.values.password
                  ? "Forgot Password"
                  : "Generate Password"}
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
            </div>
          </CardFooter>
        </Card>
        <Security />
      </div>
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
                  labelPlacement="outside"
                  label={`Enter ${formik.values.email} to delete`}
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

export default Profile;

const Security = () => {
  const [updateProcessing, setUpdateProcessing] = useState(false);
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      setUpdateProcessing(true);
      try {
        const res = await axios.put(
          `${API_BASE_URL}/api/user/profile/password`,
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
      setUpdateProcessing(false);
    },
    validate: (values) => {
      const errors: any = {};
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
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
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Current Password"
            labelPlacement="outside"
            placeholder="Enter current password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            name="oldPassword"
            type="password"
          />
          <Input
            label="New Password"
            labelPlacement="outside"
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            name="newPassword"
            type="password"
          />
          <Input
            label="Confirm Password"
            labelPlacement="outside"
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            name="confirmPassword"
            type="password"
            isInvalid={formik.errors.confirmPassword ? true : false}
            errorMessage={formik.errors.confirmPassword}
          />
        </CardBody>
        <CardFooter className="mt-4 justify-end">
          <Button
            color="primary"
            variant="flat"
            onPress={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
            isDisabled={
              formik.errors.confirmPassword ? true : false || updateProcessing
            }
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
