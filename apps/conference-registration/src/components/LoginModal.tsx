import { useEffect, useState } from "react";
import Loading from "./Loading";
import authProvider from "../providers/authProvider";
import { useUserContext } from "../AppContextProvider";

const LoginModal = () => {
  const { isLoggedIn, setIsLoggedIn } = useUserContext();
  const [authFail, setAuthFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Validation Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminRoute = urlParams.has("admin");
    setShowModal(isAdminRoute);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear error when user types
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear error when user types
  };

  const handleLogin = async () => {
    setAuthFail(false);
    let hasError = false;

    // Check for empty fields
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await authProvider.login({ username: email, password });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      setAuthFail(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md max-w-sm w-full">
          <img
            src="./orwa-black.png"
            alt="ORWA Logo"
            className="mx-auto w-24 mb-4 object-contain"
          />
          <h1 className="text-2xl font-semibold text-center mb-4">Admin Login</h1>
          <div className="mb-4">
            <input
              type="text"
              onChange={handleEmailChange}
              value={email}
              placeholder="Email"
              className={`w-full px-4 py-2 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                emailError ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1 text-left">{emailError}*</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
              className={`w-full px-4 py-2 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 text-left">{passwordError}*</p>
            )}
          </div>
          {authFail && (
            <p className="text-red-500 font-semibold mb-4 text-sm">
              Authentication failed
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginModal;