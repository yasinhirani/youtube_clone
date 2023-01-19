import * as Yup from "yup";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const LoginValidation = Yup.object({
  email: Yup.string()
    .required("Email address is required")
    .matches(emailRegex, "Email address not valid")
    .trim(),
  password: Yup.string()
    .required("Password is required")
    .matches(/^\S*$/, "Password should not contain space"),
});

export default LoginValidation;
