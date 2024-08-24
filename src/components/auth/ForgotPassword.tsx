import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link as NextLink,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { data } from "../../utils/data";

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    id: Yup.string().required("Email or Phone is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (!isSent) {
          await sendOtp();
        } else {
          await axios
            .post(`${API_BASE_URL}/api/user/verify-otp`, {
              id: values.id,
              otp: values.otp,
            })
            .then((res) => {
              console.log(res.data);
              toast.success("OTP verified successfully.");
              navigate(`/auth/reset-password?token=${res.data.token}`);
            });
        }
      } catch (error: any) {
        toast.error(error.response.data.error);
        console.log(error);
      }
    },
  });

  const sendOtp = async () => {
    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/user/forgot-password/`, {
        id: formik.values.id,
      });
      setIsSent(true);
      toast.success("OTP sent to your email/phone. Check your inbox.");
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error);
    }
    setIsSending(false);
  };
  return (
    <>
      <main className="flex h-screen items-center justify-center p-8">
        <div className="max-w-md mx-auto">
          <Card
            as={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className="p-4 min-w-96"
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
                id="id"
                type="id"
                isRequired
                onChange={formik.handleChange}
                value={formik.values.id}
                isDisabled={isSent || formik.isSubmitting}
                fullWidth
                label="Email or Phone"
                placeholder="Enter your email or phone"
                variant="bordered"
                isInvalid={formik.errors.id && formik.touched.id ? true : false}
                errorMessage={formik.errors.id}
              />
              {isSent && (
                <Input
                  id="otp"
                  type="otp"
                  required
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.otp}
                  fullWidth
                  label="OTP"
                  variant="bordered"
                  minLength={6}
                  maxLength={6}
                  isInvalid={
                    formik.errors.otp && formik.touched.otp ? true : false
                  }
                  errorMessage={formik.errors.otp}
                />
              )}
              <p className="flex justify-between ">
                {isSent && (
                  <Button
                    onPress={() => sendOtp()}
                    variant="light"
                    size="sm"
                    className="cursor-pointer"
                    isDisabled={isSending}
                    isLoading={isSending}
                  >
                    Resend OTP
                  </Button>
                )}
                <NextLink
                  size="sm"
                  as={Link}
                  className="j justify-self-end"
                  to="/auth/login"
                >
                  Back to Login
                </NextLink>
              </p>
            </CardBody>
            <CardFooter className="mt-6">
              <Button
                type="submit"
                isDisabled={formik.isSubmitting}
                fullWidth
                variant="flat"
                color="primary"
                isLoading={formik.isSubmitting}
              >
                {isSent ? "Verify OTP" : "Send OTP"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;
