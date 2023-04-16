import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { BiCloudUpload } from "react-icons/bi";
import { extractPFD } from "../../ExtractJob";
import StateSelector from "../../helper/StateSelector";

function EditJobForm({ createJob, setCreateJob }) {
  const handleImageUpload = async (file) => {
    console.log(await extractPFD(file));
  };
  const [selectedState, setSelectedState] = useState(null);
  useEffect(() => {
    if (selectedState !== null)
      setCreateJob((prev) => ({ ...prev, state: selectedState.name }));
  }, [selectedState]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 mt-5">
        <div className="flex flex-col">
          <div className="text-xs font-medium text-gray-400">Title</div>
          <div className="text-sm">{createJob.title}</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Description
          </div>
          <div className="text-sm">{createJob.description}</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            No of positions
          </div>
          <div className="text-sm">2</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Salary Scale
          </div>
          <div className="text-sm"> ₹ 20,000 - ₹ 30,000</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Experience Required
          </div>
          <div className="text-sm">1-2 Years</div>
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-medium text-gray-400">Reservation</div>
          <div className="text-sm">SC/ST</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Age Limit
          </div>
          <div className="text-sm">18-35</div>
          <div className="text-xs font-medium text-gray-400 mt-3">Location</div>
          <div className="text-sm">Panaji, Goa</div>

          <div className="text-xs font-medium text-gray-400 mt-3">Job Type</div>
          <div className="text-sm">Permanent</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Apply link
          </div>
          <div className="text-sm text-blue-500">https://jobapply.com</div>
          <div className="text-xs font-medium text-gray-400 mt-3">
            Qualification
          </div>
          <div className="text-sm">12th Pass</div>
        </div>
      </div>

      <div className="mt-3 text-white flex justify-center items-center cursor-pointer bg-blue-500 rounded-md px-2 p-1">
        View PDF
      </div>
    </div>
  );
}

export default EditJobForm;
