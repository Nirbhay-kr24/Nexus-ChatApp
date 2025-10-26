import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isLoggingIn } = useAuthStore();

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="container mx-auto max-w-7xl">
     
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden p-12 lg:p-16 min-h-[700px]">
          
         
          <div className="flex flex-col justify-center px-6 space-y-8">
            
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-10 h-10 text-teal-600" />
                <h1 className="text-4xl font-bold text-gray-800">Nexus Chat</h1>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-600 mt-2 text-lg">
                Please log in to your account.
              </p>
            </div>

          
            <form onSubmit={handleSubmit} className="space-y-6">
              
             
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="block w-full pl-12 pr-4 py-3 border rounded-xl border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

             
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="block w-full pl-12 pr-12 py-3 border rounded-xl border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

           
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="rounded border-gray-300 text-teal-600 shadow-sm focus:ring-teal-500"
                  />
                  <label htmlFor="rememberMe" className="text-gray-600 text-base">
                    Remember me
                  </label>
                </div>
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500 text-base">
                  Forgot password?
                </a>
              </div>

          
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md flex justify-center items-center gap-2 transition duration-300 text-lg disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </button>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition duration-300 text-lg text-center"
                >
                  Create account
                </Link>
              </div>
            </form>
          </div>

         
          <div className="hidden lg:flex items-center justify-center bg-gray-50">
            <img
              src="/Animation.gif"
              alt="Login Animation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
