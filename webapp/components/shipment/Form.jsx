import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StateSelector from "../helper/StateSelector";
import SelectLocationInput from "./SelectLocationInput";
function Form({ profile, setProfile }) {
    const apiUrl = "http://localhost:4000/";
    const { organisation } = useSelector((state) => state.user);

    const [selectedState, setSelectedState] = useState("");
    const [selectedCompanyType, setSelectedCompanyType] = useState("");
    const [items, setItems] = useState([]);

    const axiosInstance = axios.create({
        baseURL: apiUrl,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    const handleSubmit = () => {
        console.log("submitted");
        axiosInstance.post("/api/shipment", {
            exporter: "",
            origin: "",
            items: [
                {
                    name: "",
                    weight: "",
                    size: "",
                    instruction: "",
                },
                {
                    name: "",
                    weight: "",
                },
            ],
            arrivalDate: "",
        });
    };

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
        <div className=' flex flex-col p-7 h-[88%] w-webkit overflow-y-scroll fixed'>
            <div className='flex flex-col md:flex-row justify-between'>
                <div className='w-full md:w-[48%]'>
                    <input
                        type='text'
                        value={profile.id}
                        placeholder='Origin'
                        className='border w-full rounded-md px-4 p-2'
                        onChange={(e) => setProfile((prev) => ({ ...prev, id: e.target.value }))}
                    />
                    <input
                        type='text'
                        value={profile.origin}
                        placeholder='Destination'
                        className='border w-full rounded-md px-4 p-2 mt-4'
                        onChange={(e) =>
                            setProfile((prev) => ({
                                ...prev,
                                companyRegistrationNumber: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className='w-full md:w-[48%]'>
                    <SelectLocationInput
                        selected={selectedCompanyType}
                        setSelected={setSelectedCompanyType}
                    />
                    <input
                        type='text'
                        value={profile.industry}
                        placeholder='Industry'
                        onChange={(e) =>
                            setProfile((prev) => ({
                                ...prev,
                                industry: e.target.value,
                            }))
                        }
                        className='border w-full rounded-md px-4 p-2 mt-4'
                    />
                    <input
                        type='text'
                        value={profile.PANnumber}
                        placeholder='Organization PAN Number'
                        className='border w-full rounded-md px-4 p-2 mt-4'
                        onChange={(e) =>
                            setProfile((prev) => ({
                                ...prev,
                                PANnumber: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            <input
                type='text'
                value={profile.PANnumber}
                placeholder='Organization PAN Number'
                className='border w-full rounded-md px-4 p-2 mt-4'
                onChange={(e) =>
                    setProfile((prev) => ({
                        ...prev,
                        PANnumber: e.target.value,
                    }))
                }
            />
            <div></div>
            <div className='w-full flex flex-col'>
                <StateSelector selected={selectedState} setSelected={setSelectedState} />
                <input
                    value={profile.location}
                    placeholder='location'
                    className='border mt-1 p-2 px-4 rounded-md'
                    onChange={(e) =>
                        setProfile((prev) => ({
                            ...prev,
                            location: e.target.value,
                        }))
                    }
                />
                <textarea
                    placeholder='Address'
                    value={profile.address}
                    rows={3}
                    className='border mt-4 p-2 px-4 rounded-md'
                    onChange={(e) =>
                        setProfile((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                />
            </div>
            <div className='sm:w-[50%] gap-2 flex flex-col sm:flex-row items-center'>
                <button
                    className='bg-blue-700 w-full text-white rounded-md mt-4 py-2 px-2'
                    onClick={() => handleSubmit()}
                >
                    Create
                </button>

                <button
                    className='bg-red-400 w-full text-white rounded-md sm:mt-4 py-2 px-2'
                    onClick={resetForm}
                >
                    Clear Changes
                </button>
            </div>
        </div>
    );
}

export default Form;
