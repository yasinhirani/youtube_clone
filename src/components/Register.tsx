import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterValidation from "../shared/validation/Register.validation";

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

  const handleSubmit = (values: IRegisterValues) => {
    if (values.password === values.confirmPassword) {
      axios
        .post("http://localhost:8181/api/register", {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.data.success) {
            navigate("/login");
          } else {
            console.log(res.data.message);
          }
        });
    } else {
      console.log("Password and confirm password must match");
    }
  };

  return (
    <div className="flex-grow p-5 bg-[#0f0f0f] overflow-y-auto flex justify-center">
      <div className="w-96">
        <div className="flex justify-center items-center space-x-3 h-56">
          <figure className="w-14">
            <img src="/images/youtube_Logo.png" alt="" />
          </figure>
          <p className="text-white text-3xl">Youtube Clone</p>
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
                className="w-full bg-red-600 text-white p-3 rounded-md mt-10"
                type="submit"
              >
                Register
              </button>
              <p className="text-white font-semibold text-base mt-5 text-center">
                Already have a account,{" "}
                <Link to="/login" className="underline">
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
