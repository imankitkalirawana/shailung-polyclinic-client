import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link as NextLink,
} from "@nextui-org/react";
import { isLoggedIn } from "../../utils/auth";
import { useEffect } from "react";

const Login = () => {
  const { user } = isLoggedIn();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/user/login`, values);
        const { data } = res;
        if (data) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userData", JSON.stringify(data));
          localStorage.setItem("userId", data.user._id);
          toast.success("Logged in successfully");
          // remove session storage
          sessionStorage.removeItem("register");
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = "/dashboard";
          }
        }
      } catch (err: any) {
        toast.error(err.response.data.error);
        console.log(err);
      }
    },
  });

  const handleIdChange = (e: any) => {
    // if id includes alphabets, it's an email
    if (e.target.value.includes("@")) {
      formik.setFieldValue("email", e.target.value);
      formik.setFieldValue("phone", "");
    } else {
      formik.setFieldValue("phone", e.target.value);
      formik.setFieldValue("email", "");
    }
  };

  return (
    <>
      <main className="flex h-screen items-center justify-center p-8">
        <div className="max-w-md mx-auto">
          <Card
            as={"form"}
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <CardHeader className="flex-col">
              <div className="block text-primary">
                <span className="sr-only">Home</span>
                <img
                  className="mx-auto h-24 w-auto"
                  src="/logo.webp"
                  alt="Shailung Polyclinic"
                />
              </div>
              <h1 className="mt-6 text-2xl text-center">
                Welcome to Shailung Polyclinic 🏥
              </h1>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <Input
                type="text"
                id="id"
                name="id"
                onChange={(e) => {
                  handleIdChange(e);
                }}
                fullWidth
                label="Email or Phone"
                placeholder="Enter your email or phone"
                variant="bordered"
              />

              <Input
                type="password"
                id="Password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                fullWidth
                label="Password"
                placeholder="Enter your password"
                variant="bordered"
              />
              <p className="text-end text-small">
                <NextLink size="sm" as={Link} to="/auth/forgot-password">
                  Forgot password?
                </NextLink>
              </p>
            </CardBody>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                variant="flat"
                color="primary"
                fullWidth
                isDisabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
              >
                Login
              </Button>
              <p className="text-center text-small">
                Need to create an account?&nbsp;
                <NextLink as={Link} to="/auth/register" size="sm">
                  Sign Up
                </NextLink>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Login;
