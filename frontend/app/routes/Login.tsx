import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/User";
import logo from "../assets/logo.jpeg";
import { createUser } from "~/api/user/createUser";

const Login = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("customer");
  const { setUser, setRole: setContextRole } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && contact) {
      const payload = {name , contact_no : contact, role: role}
      const res = await createUser(payload);
      console.log( "res from create user : " , res.data);
      setUser(res.data);
      setContextRole(role);
      
      // Route based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  };

  return (
    <div className="min-h-screen h-fit flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-10">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="Logo"
          className="w-24 h-24 rounded-full shadow-md border-2 border-vsyellow"
        />
        <h1 className="text-3xl font-bold text-vsyellow mt-4 tracking-wide">
          Parking Space Login
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-vsyellow text-center mb-6">
          Enter Your Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-300 mb-1 text-lg">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
              required
            />
          </div>

          {/* Contact Input */}
          <div className="flex flex-col">
            <label htmlFor="contact" className="text-gray-300 mb-1 text-lg">
              Contact Number
            </label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-gray-300 mb-1 text-lg">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold text-lg py-2 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-10">
        © 2025 NIT Meghalaya — All Rights Reserved
      </p>
    </div>
  );
};

export default Login;
