import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthDataContext } from "../context/Context";
import LoginValidation from "../shared/validation/Login.validation";
import { toast } from "react-toastify";
import ToastConfig from "./ToastConfig";

interface ILoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const { setAuthData } = useContext(AuthDataContext);
  const navigate = useNavigate();

  const initialValues: ILoginValues = {
    email: "",
    password: "",
  };

  const [apiLoading, setApiLoading] = useState<boolean>(false);

  const handleSubmit = (values: ILoginValues) => {
    setApiLoading(true);
    axios
      .post("https://yasin-youtube-clone.vercel.app/api/login", {
        email: values.email.toLowerCase(),
        password: values.password,
      })
      .then((res) => {
        if (res.data.success) {
          setApiLoading(false);
          toast.success("Login Successful", ToastConfig);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("userEmail", res.data.authData.email);
          setAuthData(res.data.authData.email);
          navigate("/");
        } else {
          setApiLoading(false);
          // console.log(res.data.message);
          toast.error(res.data.message, ToastConfig);
        }
      })
      .catch((err) => {
        setApiLoading(false);
        if (err.code === "ERR_NETWORK") {
          toast.error("Server issue", ToastConfig);
        }
      });
  };

  return (
    <div className="flex-grow p-5 bg-[#0f0f0f] overflow-y-auto flex flex-col items-center">
      <div className="w-full sm:w-96 flex-grow">
        <div className="flex justify-center items-center h-56 min-h-[14rem]">
          <figure className="w-60">
            <img src="/images/youtube_logo_desktop.png" alt="" />
          </figure>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginValidation}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(props) => {
            const { values, errors, touched } = props;
            return (
              <Form className="mt-5">
                <div className="flex flex-col space-y-6">
                  <div className="w-full flex flex-col space-y-2 relative">
                    <label
                      className="text-white text-base font-semibold"
                      htmlFor="email"
                    >
                      Email address:
                    </label>
                    <Field
                      className="w-full bg-transparent border border-gray-500 rounded-md px-2 py-2 focus:outline-none text-white"
                      name="email"
                      id="email"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={values.email}
                      autoComplete="off"
                    />
                    {errors.email && touched.email ? (
                      <p className="font-bold text-xs text-red-500 absolute -bottom-5">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full flex flex-col space-y-2 relative">
                    <label
                      className="text-white text-base font-semibold"
                      htmlFor="password"
                    >
                      Password:
                    </label>
                    <Field
                      className="w-full bg-transparent border border-gray-500 rounded-md px-2 py-2 focus:outline-none text-white"
                      type="password"
                      name="password"
                      id="password"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={values.password}
                    />
                    {errors.password && touched.password ? (
                      <p className="font-bold text-xs text-red-500 absolute -bottom-5">
                        {errors.password}
                      </p>
                    ) : null}
                  </div>
                </div>
                <button
                  className="w-full bg-primary text-white p-3 h-12 rounded-md mt-10 flex justify-center items-center"
                  type="submit"
                >
                  {apiLoading && (
                    <div className="flex justify-center items-center space-x-2">
                      <div className="loader__dot loader__dot-1 w-2 h-2 rounded-full bg-white" />
                      <div className="loader__dot loader__dot-2 w-2 h-2 rounded-full bg-white" />
                      <div className="loader__dot loader__dot-3 w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                  {!apiLoading && (
                    <span className="font-medium text-base">Login</span>
                  )}
                </button>
                <p className="text-white font-normal text-base mt-5 text-center">
                  Don't have a account, Don't worry{" "}
                  <Link
                    to="/register"
                    className="underline font-semibold whitespace-nowrap"
                  >
                    let's Create one
                  </Link>
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
