import React from "react";
import { MdCancel } from "react-icons/md";

const Filter = () => {
  return (
    <div className="w-[20%] flex flex-col items-center">
      <div className="bg-white rounded-lg w-[90%] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 font-medium">Skills</div>
          <div className="text-red-400 text-xs cursor-pointer">Clear</div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex items-center mb-2">
            <input
              type="text"
              id="Intermediate"
              className="p-1 px-4 rounded-lg bg-[#F9FBFC] w-full shadow-inner"
              placeholder="Search by skills"
              name="fav_language"
              //   value=
            />
          </div>
          <div className="flex flex-wrap">
            {Array(3)
              .fill(1)
              .map((e, i) => (
                <div
                  key={i}
                  className="flex group mb-1 mr-1 cursor-pointer items-center w-fit rounded-sm justify-center py-[2px] text-xs bg-secondary-blue px-2"
                >
                  AC Technician
                  <MdCancel className="ml-1 -mr-1 hidden group-hover:flex rounded-full items-center justify-center" />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg w-[90%] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 font-medium">Experience level</div>
          <div className="text-red-400 text-xs cursor-pointer">Clear</div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Entry Level"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Entry Level"
            />
            <label
              htmlFor="Entry Level"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Entry Level
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Intermediate"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Intermediate"
            />
            <label
              htmlFor="Intermediate"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Intermediate
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="Expert"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Expert"
            />
            <label
              htmlFor="Expert"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Expert
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg w-[90%] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 font-medium">Job location</div>
          <div className="text-red-400 text-xs cursor-pointer">Clear</div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="On Site"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="On Site"
            />
            <label
              htmlFor="On Site"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              On Site
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="text"
              id="Intermediate"
              className="p-1 px-4 rounded-lg bg-[#F9FBFC] w-full shadow-inner"
              placeholder="Search by location"
              name="fav_language"
              //   value=
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="Remote"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Remote"
            />
            <label
              htmlFor="Remote"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Remote
            </label>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg w-[90%] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 font-medium">Job type</div>
          <div className="text-red-400 text-xs cursor-pointer">Clear</div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Full Time"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Full Time"
            />
            <label
              htmlFor="Full Time"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Full Time
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Part Time"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Part Time"
            />
            <label
              htmlFor="Part Time"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Part Time
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="Freelance"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Freelance"
            />
            <label
              htmlFor="Freelance"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Freelance
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="Internship"
              className="mr-2 cursor-pointer"
              name="fav_language"
              value="Internship"
            />
            <label
              htmlFor="Internship"
              className="text-xs font-medium text-gray-500 cursor-pointer"
            >
              Internship
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
