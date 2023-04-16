import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StateSelector from "../helper/StateSelector";
import { CreateOrganizationFunction } from "./CreateOrganizationFunction";
import SelectOrganizationType from "./SelectOrganizationType";
import { CreateOrganizationBaseJson } from "./util/CreateOrganizationJson";

function Form({ profile, setProfile }) {
  const { organisation } = useSelector((state) => state.user);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCompanyType, setSelectedCompanyType] = useState("");

  useEffect(() => {
    setProfile((prev) => ({ ...prev, state: selectedState.name }));
  }, [selectedState]);

  const resetForm = () => {
    setProfile(organisation);
    setSelectedState("");
    setSelectedCompanyType("");
  };

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      organizationType: selectedCompanyType.name,
    }));
  }, [selectedCompanyType]);

  return (
    <div className=" flex flex-col p-7 h-[88%] w-webkit overflow-y-scroll fixed">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-[48%]">
          <input
            type="text"
            value={profile.name}
            placeholder="Organization name"
            className="border w-full rounded-md px-4 p-2"
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="text"
            value={profile.companyRegistrationNumber}
            placeholder="Company Registration Number"
            className="border w-full rounded-md px-4 p-2 mt-4"
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                companyRegistrationNumber: e.target.value,
              }))
            }
          />
          <input
            type="text"
            value={profile.gstNumber}
            placeholder="Organization GST Number"
            className="border w-full rounded-md px-4 p-2 mt-4"
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                gstNumber: e.target.value,
              }))
            }
          />
        </div>

        <div className="w-full md:w-[48%]">
          <SelectOrganizationType
            selected={selectedCompanyType}
            setSelected={setSelectedCompanyType}
          />
          <input
            type="text"
            value={profile.industry}
            placeholder="Industry"
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                industry: e.target.value,
              }))
            }
            className="border w-full rounded-md px-4 p-2 mt-4"
          />
          <input
            type="text"
            value={profile.PANnumber}
            placeholder="Organization PAN Number"
            className="border w-full rounded-md px-4 p-2 mt-4"
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                PANnumber: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <textarea
        value={profile.description}
        placeholder="Description"
        rows={5}
        className="border min-h-[7rem] mt-4 p-2 px-4 rounded-md"
        onChange={(e) =>
          setProfile((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
      />
      <div className="w-full flex flex-col">
        <StateSelector
          selected={selectedState}
          setSelected={setSelectedState}
        />
        <input
          value={profile.location}
          placeholder="location"
          className="border mt-1 p-2 px-4 rounded-md"
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
        />
        <textarea
          placeholder="Address"
          value={profile.address}
          rows={3}
          className="border mt-4 p-2 px-4 rounded-md"
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        />
      </div>
      <div className="sm:w-[50%] gap-2 flex flex-col sm:flex-row items-center">
        <button
          className="bg-blue-700 w-full text-white rounded-md mt-4 py-2 px-2"
          onClick={() => CreateOrganizationFunction(profile)}
        >
          Save Changes
        </button>

        <button
          className="bg-red-400 w-full text-white rounded-md sm:mt-4 py-2 px-2"
          onClick={resetForm}
        >
          Clear Changes
        </button>
      </div>
    </div>
  );
}

export default Form;
