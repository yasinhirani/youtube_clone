import * as Yup from "yup";

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const RegisterValidation = Yup.object({
  email: Yup.string()
    .required("Email address is required")
    .matches(emailRegex, "Email address not valid"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().required("ConfirmPassword is required"),
});

export default RegisterValidation;
