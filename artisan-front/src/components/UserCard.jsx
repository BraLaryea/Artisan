import React from "react";
import Carpenter from "../assets/Carpenter.svg";
import image from "../assets/image copy.png";
import location from "../assets/Location.svg";
import Star from "../assets/Star.svg";
import { Link } from "react-router-dom";

const UserCard = ({ image, name, rating, profession, distance, id }) => {
  return (
    <Link
      to={"/artisan/" + id}
      className="bg-accent w-[60%] rounded-xl mt-5 flex"
    >
      <div>
        <img
          src={image}
          alt=""
          width={100}
          height={100}
          className="rounded-full m-3 size-20"
        />
      </div>
      <div className="flex flex-col justify-center ml-10">
        <h1 className="text-2xl font-poppins-medium text-text">{name}</h1>
        <p className="text-sm font-poppins-light text-[#D3D3D3] -mt-1">
          {profession}
        </p>
        <div className="flex">
          <img src={location} alt="" className="mt-2 w-10" />
          <p className="mt-[10.5px] -ml-2 text-text font-poppins-light text-sm">
            {distance.toFixed(2)} km
          </p>
          <div className="flex items-center mt-1 ml-2">
            {Array.from({ length: rating }).map((_, i) => (
              <img src={Star} alt="" width={30} height={30} className="" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
