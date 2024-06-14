import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExternalLinkIcon } from "../icons/Icons";
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

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: "",
    },
    onSubmit: async (values) => {
      try {
        await axios
          .post(`${API_BASE_URL}/api/user/forgot-password/`, {
            id: values.id,
          })
          .then(async (res) => {
            const api_key = "26614D70EA4E26";
            const contact = res.data.data.phone;
            const message = `Click on this link to reset your password: ${res.data.resetLink}`;
            const api_url = `https://samayasms.com.np/smsapi/index?key=${api_key}&routeid=116&contacts=${contact}&senderid=SMSBit&msg=${message}&responsetype=json`;
            toast.success("Reset Password link sent to your email/phone.");
            setIsSent(true);
            const response = await axios.get(api_url);
            console.log(response.data);
          });
      } catch (error: any) {
        toast.error("Error:", error.response.data.error);
        console.log(error.response.data.error);
      }
    },
  });

  return (
    <>
      <main className="flex h-screen items-center justify-center p-8">
        <div className="max-w-md mx-auto">
          <Card className="p-4 min-w-96">
            <CardHeader className="flex-col">
              <div className="block text-primary">
                <span className="sr-only">Home</span>
                <img
                  className="mx-auto h-24 w-auto"
                  src="/logo.webp"
                  alt="Shailung Polyclinic"
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
              />
              <p className="text-end text-small">
                <NextLink size="sm" as={Link} to="/auth/login">
                  Back to Login
                </NextLink>
              </p>
            </CardBody>
            <CardFooter className="mt-6">
              <Button
                type="submit"
                isDisabled={formik.isSubmitting}
                onPress={() => {
                  if (formik.isSubmitting) return;
                  else if (isSent)
                    window.open(
                      "https://mail.google.com/mail/u/0/#inbox",
                      "_blank"
                    );
                  else formik.handleSubmit();
                }}
                fullWidth
                variant="flat"
                color="primary"
                isLoading={formik.isSubmitting}
              >
                {isSent ? (
                  <>
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>View Mail</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;
