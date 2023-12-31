import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/action/loginAction";
import { useEffect } from "react";


const Login = () => {
  const dispatch = useDispatch();

 const {
   register,
   handleSubmit,
   watch,
   formState: { errors },
  } = useForm();
  
   const onSubmit = (data) => {
     console.log(data);
     dispatch(loginUser(data))
       .then(() => {
         // Redirect to the home page
         window.location.replace("/");
       })
       .catch((err) => console.log(err));
   };

  return (
    <div class="bg-grey-lighter min-h-screen flex flex-col">
      <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 class="mb-8 text-3xl text-center">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("email")}
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="email"
              placeholder="Email"
            />

            <input
              type="password"
              {...register("password")}
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
            />

            <button
              type="submit"
              class="w-full text-center py-3 rounded bg-green-600	 text-black hover:bg-green-dark focus:outline-none my-1"
            >
              Login
            </button>

            <div class="text-center text-sm text-grey-dark mt-4">
              By signing up, you agree to the
              <a
                class="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Terms of Service
              </a>{" "}
              and
              <a
                class="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
            <div class="text-grey-dark mt-6">
              If you don't have an account?
              <a
                class="no-underline border-b border-blue text-blue"
                href="/singup"
              >
                Sing-up
              </a>
              .
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
