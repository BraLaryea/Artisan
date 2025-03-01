import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StarGold from "../assets/StarGold.svg";

const ArtHomepage = () => {
  const { artisanId } = useParams();
  const [artisan, setArtisan] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (artisanId) {
      fetchArtisan();
    }
  }, [artisanId]);

  const fetchArtisan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/artisans/${artisanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArtisan(response.data);
    } catch (err) {
      console.error("Error fetching artisan:", err);
      setError("Failed to fetch artisan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPaystackScript = () => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadPaystackScript();
  }, []);

  const handlePay = () => {
    if (!window.PaystackPop) {
      console.error("Paystack SDK not loaded.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: "pk_test_051ade181e81be046dc3b4b456dd90e18833da3d", // Replace with your Paystack public key
      email: artisan.email || "customer@example.com",
      amount: 10000, // Amount in kobo (10000 = 100 NGN)
      currency: "GHS",
      ref: "ART" + Math.floor(Math.random() * 1000000000 + 1), // Unique reference
      callback: function (response) {
        alert("Payment successful! Transaction ref: " + response.reference);
      },
      onClose: function () {
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="bg-primary h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <section className="bg-secondary h-[70%] relative top-[30%] flex">
            <div>
              <img
                src={artisan.profile_image}
                alt=""
                width={300}
                height={300}
                className="rounded-full relative bottom-[20%] left-[5%]"
              />
            </div>
            <div className="flex flex-col relative left-[2%]">
              <h1 className="text-text font-poppins-medium text-4xl mt-[10%] font-semi-bold">
                {artisan.name || "Unknown"}
              </h1>
              <h3 className="text-text flex font-poppins-light text-xl">
                {artisan.skill || "No Profession"}{" "}
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    src={StarGold}
                    alt=""
                    width={40}
                    className="-mr-3"
                  />
                ))}
              </h3>
              <div className="my-2 text-2xl">
                {artisan.description || "No Description"}
              </div>
              <div className="my-2 text-2xl">
                {artisan.contact } | {artisan.location}
              </div>
              <div className="mt-2">
                <button
                  className="bg-text px-12 rounded-xl py-2 text-secondary font-semibold text-lg mr-5"
                  onClick={handlePay}
                >
                  Pay
                </button>
              </div>

              <div
                className="flex mt-4 gap-4 align-center flex-wrap"
                style={{ alignItems: "center" }}
              >
                {artisan.portfolio_images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.image}
                    alt="portfolio"
                    style={{ width: "200px" }}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ArtHomepage;
