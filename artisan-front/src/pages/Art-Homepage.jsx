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
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");

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

  const addReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/artisans/${artisanId}/reviews`,
        {
          rating: selectedRating,
          comment: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchArtisan();
      setReview("");
      setSelectedRating(0);
    } catch (err) {
      console.error("Error adding review:", err);
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
          <section className="bg-secondary min-h-[70%] relative top-[30%] flex">
            <div>
              <img
                src={artisan.profile_image}
                alt=""
                width={300}
                height={300}
                className="rounded-full relative bottom-[20%] left-[5%]"
              />
            </div>
            <div className="flex flex-col relative flex-grow pb-6">
              <h1 className="text-text font-poppins-medium text-4xl mt-[5%] font-semi-bold">
                {artisan.name || "Unknown"}
              </h1>
              <h3 className="text-text flex font-poppins-light text-xl">
                {artisan.skill || "No Profession"}{" "}
                <span className="text-yellow-400 font-semibold flex gap-1 ml-2">
                  {Array.from({ length: artisan.average_rating }).map(
                    (_, i) => (
                      <span key={i}>★</span>
                    )
                  )}
                </span>
              </h3>
              <div className="my-2 text-2xl" style={{ color: "white" }}>
                {artisan.description || "No Description"}
              </div>
              <div className="my-2 text-xl" style={{ color: "white" }}>
                {artisan.contact} | {artisan.location}
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
              <div className="mt-6 max-w-[90%] w-full grid grid-cols-2 gap-x-8">
                <div className="bg-white/20 rounded-xl p-6 h-max">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Comment
                  </h3>

                  <div className="space-y-3">
                    <textarea
                      rows="3"
                      placeholder="Leave a review"
                      className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>

                    <div className="flex items-center gap-2 text-white">
                      <span className="mr-2">Rating:</span>
                      <div className="flex gap-1">
                        <button
                          className={`w-8 h-8 rounded-full text-white hover:bg-yellow-400 ${
                            selectedRating == 1
                              ? "bg-yellow-500"
                              : "bg-white/20"
                          }`}
                          onClick={() => setSelectedRating(1)}
                        >
                          1
                        </button>
                        <button
                          className={`w-8 h-8 rounded-full text-white hover:bg-yellow-400 ${
                            selectedRating == 2
                              ? "bg-yellow-500"
                              : "bg-white/20"
                          }`}
                          onClick={() => setSelectedRating(2)}
                        >
                          2
                        </button>
                        <button
                          className={`w-8 h-8 rounded-full text-white hover:bg-yellow-400 ${
                            selectedRating == 3
                              ? "bg-yellow-500"
                              : "bg-white/20"
                          }`}
                          onClick={() => setSelectedRating(3)}
                        >
                          3
                        </button>
                        <button
                          className={`w-8 h-8 rounded-full text-white hover:bg-yellow-400 ${
                            selectedRating == 4
                              ? "bg-yellow-500"
                              : "bg-white/20"
                          }`}
                          onClick={() => setSelectedRating(4)}
                        >
                          4
                        </button>
                        <button
                          className={`w-8 h-8 rounded-full text-white hover:bg-yellow-400 ${
                            selectedRating == 5
                              ? "bg-yellow-500"
                              : "bg-white/20"
                          }`}
                          onClick={() => setSelectedRating(5)}
                        >
                          5
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                        onClick={() => {
                          setReview("");
                          setSelectedRating(0);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-white/30 text-white rounded-lg disabled:cursor-not-allowed disabled:text-gray-500"
                        disabled={!selectedRating || !review}
                        onClick={addReview}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {artisan.reviews?.length == 0 ? (
                    <p className="text-white/70 text-sm italic">
                      No reviews yet. Be the first to leave one!
                    </p>
                  ) : (
                    <>
                      {artisan.reviews?.map((review, index) => (
                        <div className="bg-white/10 p-4 rounded-lg" key={index}>
                          <div className="flex justify-between text-white">
                            <div>
                              <p className="font-semibold">{review.user}</p>
                              <p className="text-white/70 text-sm">
                                "{review.comment}"
                              </p>
                            </div>
                            <span className="text-yellow-400 font-semibold">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <span key={i}>★</span>
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ArtHomepage;
