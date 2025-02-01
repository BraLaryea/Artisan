import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Ma from "../assets/Ma.svg";
import ArtisanLink from "../assets/ArtisanLink.svg";
import Google from "../assets/Google.svg";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Redirect user based on role (adjust as needed)
      window.location.href = "/homepage"; // or '/arthomepage' for artisans
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
              <img src={ArtisanLink} alt="" className="w-[15%]" />
              <h1 className="text-6xl font-poppins-medium text-text">
                ArtisanLink
              </h1>
            </div>

            <div className="flex justify-center">
              <h1 className="text-2xl font-poppins-light text-text pt-3">
                Welcome back to our app
              </h1>
              <Link
                to="/register"
                className="relative left-[8%] text-2xl font-poppins-light text-text pt-3 underline"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex-col flex p-[15%]">
            <label
              htmlFor="email"
              className="font-poppins-light text-text text-lg mb-1"
            >
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

            <label
              htmlFor="password"
              className="font-poppins-light text-text text-lg mb-2 mt-5"
            >
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

            <div className="pt-[5%]">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label
                htmlFor="remember"
                className="font-poppins-light text-text text-lg pl-2"
              >
                Remember Me
              </label>
            </div>

            {error && <p className="text-red-500 text-lg mt-2">{error}</p>}

            <button
              type="submit"
              className="border-none bg-accent shadow-2xl w-[100%] mt-5 font-poppins-light p-3.5 text-text text-xl rounded-2xl tracking-wide"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link to="/arthomepage">
              <button className="border-none shadow-2xl w-[100%] mt-5 font-poppins-light p-3.5 text-xl rounded-2xl tracking-wide flex justify-center bg-primary text-secondary">
                <img
                  src={Google}
                  alt=""
                  width={45}
                  height={45}
                  className="right-10"
                />
                Login with Google
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
            alt=""
            className="w-[50%] absolute top-[20%] bottom-[50%] left[76%] right-[8%]"
          />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
