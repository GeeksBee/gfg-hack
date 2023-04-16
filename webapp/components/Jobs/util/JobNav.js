import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import JobForm from "./JobForm";
import SearchBox from "./SearchBox";

function JobNav({
  createJob,
  setCreateJob,
  submitJobFunction,
  setQuery,
  query,
}) {
  let [openModal, setOpenModal] = useState(false);

  const closeModal = () => setOpenModal(false);

  return (
    <div className="flex justify-center gap-1 mx-2 overflow-visible">
      <div className="flex mt-2 justify-between items-center w-full">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 md:static my-auto fixed bottom-4 right-4 ml-5 lg:ml-1 p-2 px-6 text-white rounded-md"
        >
          Add Job
        </button>

        <div className="sm:p-[6px] px-3 rounded-md border p-2 mx-3 md:ml-auto my-auto w-full md:w-64 flex items-center">
          <BiSearch className="text-xl mx-2" />
          <input
            type="text"
            placeholder="Search..."
            className="flex w-full outline-none bg-transparent  "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.length > 0 && (
            <MdClear
              className="text-xl mx-2 cursor-pointer dark:text-white"
              onClick={() => setQuery("")}
            />
          )}
        </div>
      </div>

      <JobForm
        openModal={openModal}
        closeModal={closeModal}
        createJob={createJob}
        setCreateJob={setCreateJob}
        submitJobFunction={submitJobFunction}
      />
    </div>
  );
}

export default JobNav;
