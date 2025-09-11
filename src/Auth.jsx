import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, LogIn, UserPlus } from "lucide-react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3001/api";

function Auth({ onLogin, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("portfolio_token", data.token);
        localStorage.setItem("portfolio_user", JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setErrors({ submit: data.error || "Authentication failed" });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleClick = () => {
    useNavigate("/");
  };

  return (
    <div className={`auth-overlay ${darkMode ? "dark" : ""}`}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
            </div>
            <h2 className="auth-title">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to edit your portfolio"
                : "Create an account to manage your portfolio"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && (
              <div className="error-message global-error">{errors.submit}</div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`auth-input ${errors.username ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`auth-input ${errors.password ? "error" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`auth-input ${
                      errors.confirmPassword ? "error" : ""
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
            )}

            <button
              onClick={handleClick}
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <div className="button-spinner"></div>
              ) : (
                <>
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* <div className="auth-footer">
            <p className="auth-switch">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="auth-switch-button"
                onClick={toggleAuthMode}
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Auth;
