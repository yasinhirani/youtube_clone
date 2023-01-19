import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegisterValidation from "../shared/validation/Register.validation";
import ToastConfig from "./ToastConfig";

interface IRegisterValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();

  const initialValues: IRegisterValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [apiLoading, setApiLoading] = useState<boolean>(false);

  const handleSubmit = (values: IRegisterValues) => {
    setApiLoading(true);
    if (values.password === values.confirmPassword) {
      axios
        .post("https://yasin-youtube-clone.onrender.com/api/register", {
          email: values.email.toLowerCase(),
          password: values.password,
        })
        .then((res) => {
          if (res.data.success) {
            setApiLoading(false);
            toast.success(res.data.message, ToastConfig);
            navigate("/login");
          } else {
            setApiLoading(false);
            toast.error(res.data.message, ToastConfig);
            // console.log(res.data.message);
          }
        })
        .catch((err) => {
          setApiLoading(false);
          if (err.code === "ERR_NETWORK") {
            toast.error("Server issue", ToastConfig);
          }
        });
    } else {
      toast.error("Password and confirm password must match", ToastConfig);
      // console.log("Password and confirm password must match");
    }
  };

  return (
    <div className="flex-grow p-5 bg-[#0f0f0f] overflow-y-auto flex justify-center">
      <div className="w-96">
        <div className="flex justify-center items-center h-56">
          <figure className="w-60">
            <img src="/images/youtube_logo_desktop.png" alt="" />
          </figure>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterValidation}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ submitForm, values, setFieldValue, errors }) => (
            <form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
            >
              <div className="flex flex-col space-y-6">
                <div className="w-full flex flex-col space-y-2 relative">
                  <label
                    className="text-white text-base font-semibold"
                    htmlFor="email"
                  >
                    Email address:
                  </label>
                  <input
                    className="w-full bg-transparent border border-gray-500 rounded-md px-2 py-2 focus:outline-none text-white"
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    value={values.email}
                    autoComplete="off"
                  />
                  <p className="font-bold text-xs text-red-500 absolute -bottom-5">
                    {errors.email}
                  </p>
                </div>
                <div className="w-full flex flex-col space-y-2 relative">
                  <label
                    className="text-white text-base font-semibold"
                    htmlFor="password"
                  >
                    Password:
                  </label>
                  <input
                    className="w-full bg-transparent border border-gray-500 rounded-md px-2 py-2 focus:outline-none text-white"
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setFieldValue("password", e.target.value)}
                    value={values.password}
                  />
                  <p className="font-bold text-xs text-red-500 absolute -bottom-5">
                    {errors.password}
                  </p>
                </div>
                <div className="w-full flex flex-col space-y-2 relative">
                  <label
                    className="text-white text-base font-semibold"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password:
                  </label>
                  <input
                    className="w-full bg-transparent border border-gray-500 rounded-md px-2 py-2 focus:outline-none text-white"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={(e) =>
                      setFieldValue("confirmPassword", e.target.value)
                    }
                    value={values.confirmPassword}
                  />
                  <p className="font-bold text-xs text-red-500 absolute -bottom-5">
                    {errors.confirmPassword}
                  </p>
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
                  <span className="font-medium text-base">Register</span>
                )}
              </button>
              <p className="text-white font-normal text-base mt-5 text-center">
                Already have a account,{" "}
                <Link to="/login" className="underline font-semibold">
                  let's Login
                </Link>
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
