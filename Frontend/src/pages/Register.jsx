import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { themeClass } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Username",
        text: "Username must be at least 6 characters long.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (
      formData.password.length < 6 ||
      !/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long and include at least one uppercase letter and one number.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://wondernotes.onrender.com/jwtauth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome, ${formData.username}!`,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "An error occurred during registration.",
      });
    }
  };

  return (
    <div className={`mt-20 ${themeClass}`}>
      <form className={`max-w-sm mx-auto`} onSubmit={handleSubmit}>
        <h2
          htmlFor="username"
          className={`block mb-4 text-2xl font-medium ${themeClass}`}
        >
          Create a user
        </h2>
        <hr className="mb-10" />
        <div className={`mb-5 ${themeClass}`}>
          <label
            htmlFor="username"
            className={`block mb-2 text-sm font-medium ${themeClass}`}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${themeClass}`}
            placeholder="John Doe"
            required
          />
        </div>
        <div className={`mb-5 ${themeClass}`}>
          <label
            htmlFor="email"
            className={`block mb-2 text-sm font-medium ${themeClass}`}
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${themeClass}`}
            placeholder="example@gmail.com"
            required
          />
        </div>
        <div className={`mb-5 ${themeClass}`}>
          <label
            htmlFor="password"
            className={`block mb-2 text-sm font-medium ${themeClass}`}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${themeClass}`}
            required
          />
        </div>
        <button
          type="submit"
          className={`${themeClass} bg-gray-300 hover:bg-gray-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${themeClass}`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
