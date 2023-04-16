import axios from "axios";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { BiCloudUpload } from "react-icons/bi";
// import { extractPFD } from "../../ExtractJob";
// import StateSelector from "../../helper/StateSelector";

function JobFormComp({ createJob, setCreateJob }) {
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file[0]);

    const res = await axios.post("http://localhost:8080/job/upload", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    setCreateJob({ ...createJob, path: res.data.filename });
  };

  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    if (selectedState !== null)
      setCreateJob((prev) => ({ ...prev, state: selectedState.name }));
  }, [selectedState]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={createJob.title}
        placeholder="Title name"
        className="border w-full rounded-md px-4 mt-3 p-2"
        onChange={(e) => {
          setCreateJob((prev) => {
            return { ...prev, title: e.target.value };
          });
        }}
      />

      <textarea
        placeholder="Description"
        rows={5}
        value={createJob.description}
        onChange={(e) => {
          setCreateJob((prev) => {
            return { ...prev, description: e.target.value };
          });
        }}
        className="border mt-3 w-full p-2 px-4 rounded-md"
      />

      <input
        type="text"
        value={createJob.applicationLink}
        placeholder="Application link"
        className="border w-full rounded-md px-4 mt-1 p-2"
        onChange={(e) => {
          setCreateJob((prev) => {
            return { ...prev, applicationLink: e.target.value };
          });
        }}
      />

      <div className="mt-3">
        <Dropzone onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="h-auto rounded-md py-6 bg-blue-200 flex flex-col justify-center items-center">
                <div>
                  <BiCloudUpload className="text-4xl text-blue-700" />
                </div>
                <text className="mt-2 text-center text-blue-700">
                  Drag and drop or click to add file
                </text>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default JobFormComp;
