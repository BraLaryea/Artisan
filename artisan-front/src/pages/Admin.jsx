import { useState } from "react";
import axios from "axios";
import uploadIcon from "../assets/upload.png"; // Replace with actual upload icon
import defaultProfile from "../assets/default-profile.png"; // Default profile picture

const Admin = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    skill: "",
    contact: "",
    location: "",
    profilePicture: null,
    portfolio: [],
  });

  const [profilePreview, setProfilePreview] = useState(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const locations = ["Abetifi", "Pepease", "Nkwatia", "Asakraka", "Mpraeso", "Bokuruwa"];
  const skills = [
    "Carpenter",
    "Fashion Desinger",
    "Plumber",
    "Electrician",
    "Painter",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setProfilePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, portfolio: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "portfolio") {
        formData[key].forEach((file) =>
          formDataToSend.append("portfolio[]", file)
        );
      } else if (key === "profilePicture" && formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    try {
      await axios.post("http://localhost:8000/api/artisans", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Artisan uploaded successfully!");
      setFormData({
        name: "",
        description: "",
        skill: "",
        contact: "",
        location: "",
        profilePicture: null,
        portfolio: [],
      });
      setProfilePreview(defaultProfile);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center">
      <section className="bg-secondary p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-text text-4xl font-poppins-medium text-center mb-6">
          Upload Artisan Info
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture Upload */}
          <div className="text-center">
            <label className="block text-text font-poppins-light text-lg mb-2">
              Profile Picture
            </label>
            <div className="flex justify-center">
              <label className="cursor-pointer relative">
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full border-4 border-text shadow-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-lg border-none outline-none"
              placeholder="Enter Artisan's Name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-lg border-none outline-none"
              placeholder="Enter Artisan's Description"
              rows="3"
              required
            />
          </div>

          {/* Skill */}
          <div>
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Skill
            </label>
            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-lg border-none outline-none"
              required
            >
              <option value="">Select Skill</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Phone Number
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-lg border-none outline-none"
              placeholder="Enter Phone Number"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-lg border-none outline-none"
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Upload */}
          <div className="text-center">
            <label className="text-text font-poppins-light text-lg mb-1 block">
              Portfolio Images
            </label>
            <label className="cursor-pointer bg-text text-secondary p-3 rounded-xl inline-flex items-center space-x-3">
              <img src={uploadIcon} alt="Upload" width={24} />
              <span className="text-lg">Upload Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-text text-secondary py-4 rounded-xl text-lg font-semibold tracking-wide"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Artisan"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Admin;
