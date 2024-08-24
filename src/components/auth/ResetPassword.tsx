import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useEffect } from "react";
import { data } from "../../utils/data";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth/forgot-password");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      token: token,
    },
    validate: (values) => {
      const errors: any = {};
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/user/reset-password`,
          values
        );
        toast.success(response.data.message);
        navigate("/auth/login");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <Card
        as={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        className="p-4 max-w-96 mx-auto my-12"
      >
        <CardHeader className="flex-col">
          <div className="block text-primary">
            <span className="sr-only">Home</span>
            <img
              className="mx-auto h-24 w-auto"
              src="/logo.webp"
              alt={data.title}
            />
          </div>
          <h1 className="mt-6 text-2xl text-center">Forgot Password</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <Input
            label="New Password"
            id="newPassword"
            type="password"
            isRequired
            required
            onChange={formik.handleChange}
            value={formik.values.newPassword}
          />
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            isRequired
            required
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            // className={`input input-bordered w-full ${
            //   formik.errors.confirmPassword && formik.touched.confirmPassword
            //     ? "input-error"
            //     : ""
            // }`}
            isInvalid={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? true
                : false
            }
            errorMessage={formik.errors.confirmPassword}
          />
        </CardBody>
        <CardFooter>
          <Button
            type="submit"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            fullWidth
            variant="flat"
            color="primary"
          >
            Reset Password
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ResetPassword;
