import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/MapView";
import UserCard from "../components/UserCard";
import Search from "../assets/Search.svg";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const skills = [
    "Carpenter",
    "Fashion Desinger",
    "Plumber",
    "Electrician",
    "Painter",
  ];

  useEffect(() => {
    // Get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // const { latitude, longitude } = position.coords;
          const latitude = 6.6554;
          const longitude = -0.7462;
          setCurrentPosition({ latitude, longitude });
          // console.log("User Location:", latitude, longitude);

          // Fetch artisans near the user
          fetchArtisans(latitude, longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Location access denied. Unable to fetch artisans.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchArtisans = async (lat, lon) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get("http://localhost:8000/api/artisans", {
        params: { latitude: lat, longitude: lon }, // Send user's location
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data || []); // Assuming API returns an `artisans` array
      setFilteredUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching artisans:", err);
      setError("Failed to fetch artisans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filter(e);
    // Filter artisans based on the search term (profession or name)
  };

  const filter = (value) => {
    const filtered = users.filter(
      (user) =>
        user.skill.toLowerCase().includes(value.toLowerCase()) ||
        user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  return (
    <div>
      <div className="flex">
        <section className="w-[50%]">
          {!loading && (
            <MapView
              artisans={filteredUsers}
              currentPosition={currentPosition}
            />
          )}
        </section>
        <section className="bg-primary w-[50%]">
          <div className="flex justify-center">
            <h1 className="text-4xl font-poppins-medium text-accent pt-[10%] pb-5 font-bold">
              Artisans Around You
            </h1>
          </div>
          <div className="flex h-13 w-[100%] bg-accent bg-opacity-[53%] items-center justify-center">
            <div className="flex justify-center whitespace-nowrap p-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  filter("");
                }}
                className="bg-primary px-[4%] mx-2 h-7 rounded-full"
              >
                All
              </button>
              {skills.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(skill);
                    filter(skill);
                  }}
                  className="bg-primary px-[4%] mx-2 h-7 rounded-full"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-[5%]">
            <img
              src={Search}
              alt=""
              width={40}
              height={40}
              className="p-0 m-0 relative left-[7%]"
            />
            <input
              type="search"
              className="bg-accent w-[80%] p-5 pl-16 rounded-full m-0"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ color: "white" }}
            />
          </div>
          <div className="w-[100%] h-[60%] flex overflow-y-auto no-scrollbar flex-col items-center">
            {loading ? (
              <p className="text-white">Loading artisans...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <UserCard
                  key={index}
                  name={user.name}
                  image={user.profile_image}
                  distance={user.distance}
                  profession={user.profession}
                  rating={user.rating}
                  id={user.id}
                />
              ))
            ) : (
              <p className="text-white mt-2">No artisans found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
