import axios from "axios";
import { Formik } from "formik";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthDataContext } from "../context/Context";
import LoginValidation from "../shared/validation/Login.validation";

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

  const handleSubmit = (values: ILoginValues) => {
    axios.post("http://localhost:8181/api/login", values).then((res) => {
      if (res.data.success) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("userEmail", res.data.authData.email);
        setAuthData(res.data.authData.email);
        navigate("/");
      } else {
        console.log(res.data.message);
      }
    });
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
          validationSchema={LoginValidation}
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
              </div>
              <button
                className="w-full bg-red-600 text-white p-3 rounded-md mt-10"
                type="submit"
              >
                Login
              </button>
              <p className="text-white font-semibold text-base mt-5 text-center">
                Don't have a account, Don't worry <Link to="/register" className="underline">let's Create one</Link>
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;