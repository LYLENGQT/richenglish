import { useForm } from "react-hook-form";
import { login } from "../../lib/axios/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem("rememberedEmail") || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: savedEmail,
      remember: !!savedEmail,
    },
  });

  const onSubmit = async (data) => {
    const { email, password, remember } = data;

    try {
      const response = await login(email, password, remember);

      if (response) {
        toast.success("Login Success");

        reset();

        if (response.user.role === "teacher")
          navigate("/portal/teacher/dashboard");
        if (response.user.role === "admin") navigate("/portal/admin/dashboard");
        if (response.user.role === "super-admin")
          navigate("/portal/super-admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data?.error) {
        const message = error.response.data.error.message;
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Rich English Teacher Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 
                focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 
                focus:border-blue-500 focus:z-10 sm:text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              {...register("remember")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
              text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo credentials: teacher.mitch@richenglish.com / password
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
