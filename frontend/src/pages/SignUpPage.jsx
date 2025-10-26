import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail, Lock, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const { signup, isSigningUp } = useAuthStore();

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirm) e.confirm = "Passwords do not match";
    if (!formData.agree) e.agree = "You must accept the terms";

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error(Object.values(e)[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    signup({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
          
         
          <div className="flex flex-col justify-center p-10">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-10 h-10 text-teal-600" />
              <h1 className="text-4xl font-bold text-gray-800">Nexus Chat</h1>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-gray-500 mb-8">Join the community and start chatting instantly.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-10 py-3 border rounded-lg border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  placeholder="Re-enter your password"
                  className="block w-full px-3 py-3 border rounded-lg border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
              </div>

             
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-1"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-teal-600 hover:underline">Terms of Service</span> and{" "}
                  <span className="text-teal-600 hover:underline">Privacy Policy</span>.
                </label>
              </div>
              {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}

             
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md flex justify-center items-center gap-2 transition duration-300 disabled:opacity-50"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-teal-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </div>

          
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <img
              src="/Animation.gif"
              alt="Signup Animation"
              className="w-full h-auto max-w-lg object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
