import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { adminLoginThunk } from "@/redux/action/actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AppDispatch } from "@/redux/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      loginSchema.parse({ email, password });

      await dispatch(adminLoginThunk({ email, password }))
        .unwrap()
        .then(() => {
          toast.success("Login successful", { duration: 2000 });
          navigate("/admin/dashboard");
        })
        .catch((err: string) => {
          // Show toast
          toast.error(err || "Login failed", { duration: 2000 });

          // Attach field-level errors if possible
          if (err.toLowerCase().includes("password")) {
            setErrors((prev) => ({ ...prev, password: err }));
          } else if (err.toLowerCase().includes("email")) {
            setErrors((prev) => ({ ...prev, email: err }));
          }
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce<LoginErrors>(
          (acc, issue) => {
            if (typeof issue.path[0] === "string") {
              acc[issue.path[0]] = issue.message;
            }
            return acc;
          },
          {}
        );
        setErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your Prosphere admin account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 pr-3 py-2.5 w-full rounded-lg border ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-600 inline-block"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`pl-10 pr-10 py-2.5 w-full rounded-lg border ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-600 inline-block"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Need help? Contact{" "}
          <a
            href="mailto:support@prosphere.com"
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            support@prosphere.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
