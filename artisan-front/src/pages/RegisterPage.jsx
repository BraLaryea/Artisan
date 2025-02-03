import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Ma from "../assets/Ma.svg";
import ArtisanHub from "../assets/ArtisanLink.svg";
import Google from "../assets/Google.svg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }
      );

      // Redirect user after successful registration
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary">
      <div className="flex">
        {/* Sidebar */}
        <section className="bg-secondary w-[40%] h-screen">
          <div className="justify-center relative top-[10%]">
            <div className="flex justify-center relative">
              <img src={ArtisanHub} alt="ArtisanHub Logo" className="w-[15%]" />
              <h1 className="text-6xl font-poppins-medium text-text">
                Landloard ArtisanHub
              </h1>
            </div>

            <div className="flex justify-center">
              <h1 className="text-2xl font-poppins-light text-text pt-3">
                Create an account
              </h1>
              <Link
                to="/"
                className="relative left-[8%] text-2xl font-poppins-light text-text pt-3 underline"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="flex-col flex p-[15%]">
            <label className="font-poppins-light text-text text-lg mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 rounded-xl text-xl"
              placeholder="Your Name"
              required
            />

            <label className="font-poppins-light text-text text-lg mb-1 mt-5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 rounded-xl text-xl"
              placeholder="Your Email"
              required
            />

            <label className="font-poppins-light text-text text-lg mb-2 mt-5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-4 rounded-xl text-xl"
              placeholder="Your Password"
              required
            />

            <label className="font-poppins-light text-text text-lg mb-2 mt-5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-4 rounded-xl text-xl"
              placeholder="Confirm Password"
              required
            />

            {error && <p className="text-red-500 text-lg mt-2">{error}</p>}

            <button
              type="submit"
              className="border-none bg-accent shadow-2xl w-[100%] mt-5 font-poppins-light p-3.5 text-text text-xl rounded-2xl tracking-wide"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <Link to="">
              <button className="border-none shadow-2xl w-[100%] mt-5 font-poppins-light p-3.5 text-xl rounded-2xl tracking-wide flex justify-center bg-primary text-secondary">
                <img
                  src={Google}
                  alt="Google Icon"
                  width={45}
                  height={45}
                  className="right-10"
                />
                Sign up with Google
              </button>
            </Link>
          </form>
        </section>

        {/* Divider */}
        <section className="bg-secondary opacity-50 w-[2%]"></section>

        {/* Image */}
        <section>
          <img
            src={Ma}
            alt="Illustration"
            className="w-[50%] absolute top-[20%] bottom-[50%] left[76%] right-[8%]"
          />
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
