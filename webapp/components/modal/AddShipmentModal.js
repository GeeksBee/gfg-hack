import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { message, Spin } from "antd";
// import ToggleSwitch from "../buttons/ToggleSwitch";
import { HiPlus } from "react-icons/hi";
import { Select } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import ShipmentInputComponent from "./ShipmentInputComponent";
import axiosInstance from "../../service/axiosInstance";
import { ethers } from "ethers";
import RealEstate from "../../abis/RealEstate.json";
import Escrow from "../../abis/Escrow.json";

// Config
import config from "../../config.json";

const antIcon = <LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />;

const apiUrl = "http://localhost:8000/api/shipment";

function calculateTax(amount, taxString) {
    if (taxString === "0") {
        return 0;
    } else if (taxString === "14_12" || taxString === "28_12") {
        let tx = taxString.split("_");
        return amount * (+tx[0] / 100) + amount * (+tx[1] / 100);
    } else if (taxString.includes("_")) {
        let tx = taxString.replace("_", ".");
        return amount * (+tx / 100);
    } else {
        return amount * (+taxString / 100);
    }
}

const AddShipmentModal = ({ setShowModal }) => {
    const { user, selectedBusiness, orders, selectedBusinessIndex, services } = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const [provider, setProvider] = useState(null);
    const [escrow, setEscrow] = useState(null);

    const [account, setAccount] = useState(null);

    const loadBlockchainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        const seller = await provider.getSigner();

        const realEstate = new ethers.Contract(
            config[network.chainId].realEstate.address,
            RealEstate,
            provider
        );

        const transaction = await realEstate
            .connect(seller)
            .mint(`http://localhost:8000/static/json/nft1.json`);
        const result = await transaction.wait();

        console.log(result);

        const escrow = new ethers.Contract(
            config[network.chainId].escrow.address,
            Escrow,
            provider
        );

        window.ethereum.on("accountsChanged", async () => {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = ethers.utils.getAddress(accounts[0]);
            setAccount(account);
        });
    };

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [importerAddress, setImporterAddress] = useState("");
    const [exporterAddress, setExporterAddress] = useState("");
    const [ports, setPorts] = useState([]);

    const [search, setSearch] = useState("");
    const [search2, setSearch2] = useState("");

    // Row 2
    const [orderProductModalOpen, setOrderProductModalOpen] = useState(false);
    const [items, setItems] = useState([
        {
            name: "",
            weight: "",
            quantity: 0,
            unit: "",
            dimension: "",
        },
    ]);

    const [list, setList] = useState([]);
    const [list2, setList2] = useState([]);
    const [selectedList, setSelectedList] = useState([]);
    const [selectedList2, setSelectedList2] = useState([]);

    const handleAddBlankItem = () => {
        items.push(itemTemplate);
        setItems([...items]);
    };

    const handleSearch = async (search) => {
        if (search && search.length > 0) {
            try {
                console.log(ports);
                const selectedStuff = ports.filter((x) => {
                    return x.toLowerCase().includes(search.toLowerCase());
                });
                console.log({ selectedStuff });
                const myList = selectedStuff.splice(0, 5);

                setList(myList);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSearch2 = async (search) => {
        if (search && search.length > 0) {
            try {
                console.log(ports);
                const selectedStuff = ports.filter((x) => {
                    return x.toLowerCase().includes(search.toLowerCase());
                });
                console.log({ selectedStuff });
                const myList = selectedStuff.splice(0, 5);

                setList2(myList);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleItemDelete = (index) => {
        let newArr = items.filter((ele, i) => index !== i);
        setItems([...newArr]);
    };

    const [sendLoading, setSendLoading] = useState(false);

    useEffect(() => {
        try {
            axiosInstance.get("/port").then((res) => {
                setPorts(res.data.map((x) => x.code));
            });
        } catch (err) {
            console.log({ err }, "hi");
        }
    }, []);

    const handleChange = (value) => {
        console.log(value);
        setSelectedList(value);
    };
    const handleChange2 = (value) => {
        setSelectedList2(value);
    };

    const handleSubmit = async () => {
        // if (items.length === 0) return message.error("Please enter atleast one item");

        // for (let i = 0; i < items.length; i++) {
        //     if (items[i]?.name?.length === 0)
        //         return message.error(`Please enter item ${i + 1}'s name`);
        //     if (items[i]?.price.length === 0)
        //         return message.error(`Please enter item ${i + 1}'s price`);
        // }

        setSendLoading(true);

        try {
            const body = {
                origin: selectedList,
                destination: selectedList2,
                importerAddress,
                exporterAddress,
                items,
            };

            console.log(body);
            const { data } = await axios.post(apiUrl, body, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("data", data);
            const { hash, id } = data;
            loadBlockchainData();
            // mint token using hash id

            setShowModal((prev) => !prev);
        } catch (error) {
            setSendLoading(false);
            console.log(error);
        }
    };

    const options = list.map((job) => (
        <option key={job} value={job} selected={selectedList[0] == job}>
            {job}
        </option>
    ));
    const options2 = list2.map((job) => (
        <option key={job} value={job} selected={selectedList2[0] == job}>
            {job}
        </option>
    ));

    console.log(ports.length);
    return (
        <>
            <div className='sm:bg-white sm:1F1E1F] sm:border sm:303131] rounded-xl overflow-hidden sm:mt-4 w-[95%]'>
                <div className='flex items-center flex-col justify-center sm:bg-[#F2F6FB] sm:303131]'>
                    <div className='my-4 hidden sm:block font-medium '>New Shipment</div>
                    <div className='md:p-10 pt-2 sm:pt-5 sm:bg-white sm:1F1E1F] rounded-xl flex flex-col sm:h-[68vh] w-full overflow-scroll '>
                        {/* 1st Row  */}
                        <div className='flex flex-col sm:px-4 md:px-0 md:flex-row md:justify-center md:gap-3'>
                            {/* 2nd Column */}
                            <div className=' md:w-[33.33%]'>
                                <div className='border-dashed border border-slate-400 mb-5 rounded-lg p-4 flex flex-col gap-3'>
                                    <div className='relative group cursor-text w-full'>
                                        <Select
                                            showSearch
                                            value={selectedList}
                                            placeholder={"Please select"}
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={handleSearch}
                                            onChange={handleChange}
                                            notFoundContent={null}
                                            style={{
                                                width: "100%",
                                            }}
                                            getPopupContainer={(triggerNode) => {
                                                return triggerNode.parentNode;
                                            }}
                                        >
                                            {options}
                                        </Select>
                                    </div>

                                    <div className='relative group cursor-text w-full'>
                                        <textarea
                                            type='text'
                                            id='exporterAddress'
                                            value={exporterAddress}
                                            onChange={(e) => setExporterAddress(e.target.value)}
                                            required
                                            className='w-full h-[5.6rem] px-4 py-3 bg-[#EAF0F7] 303131]   text-sm peer cursor-text rounded-md outline-none'
                                        />
                                        <label
                                            htmlFor='exporterAddress'
                                            className='transform text-gray-500 -400 cursor-text transition-all absolute -top-8 left-2 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:translate-y-[15%] peer-valid:translate-y-[15%] group-focus-within:pl-2 peer-valid:pl-2'
                                        >
                                            Importer Address
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 3rd Column */}
                            <div className=' md:w-[33.33%]'>
                                <div className='border-dashed border border-slate-400 mb-5 rounded-lg p-4 flex flex-col gap-3'>
                                    <div className='relative group cursor-text w-full'>
                                        <Select
                                            showSearch
                                            value={selectedList2}
                                            placeholder={"Please select"}
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={handleSearch2}
                                            onChange={handleChange2}
                                            notFoundContent={null}
                                            style={{
                                                width: "100%",
                                            }}
                                            getPopupContainer={(triggerNode) => {
                                                return triggerNode.parentNode;
                                            }}
                                        >
                                            {options2}
                                        </Select>
                                    </div>
                                    <div className='relative group cursor-text w-full'>
                                        <textarea
                                            type='text'
                                            id='importerAddress'
                                            value={importerAddress}
                                            onChange={(e) => setImporterAddress(e.target.value)}
                                            required
                                            className='w-full h-[5.6rem] px-4 py-3 bg-[#EAF0F7] 303131]   text-sm peer cursor-text rounded-md outline-none'
                                        />
                                        <label
                                            htmlFor='importerAddress'
                                            className='transform text-gray-500 -400 cursor-text transition-all absolute -top-8 left-2 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:translate-y-[15%] peer-valid:translate-y-[15%] group-focus-within:pl-2 peer-valid:pl-2'
                                        >
                                            Exporter Address
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 1st Column */}
                            {/* <div className=' md:w-[32.5%]'>
                                <div className='border-dashed border border-slate-400 mb-5 rounded-lg p-4'></div>
                                <div className='border-dashed border border-slate-400 mb-5 rounded-lg p-4'></div>
                            </div> */}
                        </div>

                        {/* 2nd Row  */}
                        <div className='mb-2 rounded-lg pt-3 md:m-auto md:w-[68%]'>
                            <div className='mb-1 pl-2 text-gray-600 -400'>Items</div>
                            <div className='relative border-dashed border p-4 border-slate-400 rounded-lg mb-4 w-full m-auto overflow-x-scroll '>
                                <table className='w-full'>
                                    <thead className='bg-[#F2F6FB] 303131]  rounded-2xl'>
                                        <tr className='rounded-lg'>
                                            <th className='w-1/12 min-w-[4rem] text-center text-xs font-semibold py-3 rounded-l-lg'>
                                                #
                                            </th>
                                            <th className='w-3/12 min-w-[12rem] font-semibold py-3 text-xs'>
                                                Name
                                            </th>
                                            <th className='w-1/12 min-w-[4rem] text-center text-xs font-semibold py-3'>
                                                Weight
                                            </th>
                                            <th className='w-1/12 min-w-[3rem] text-center font-semibold py-3 text-xs'>
                                                Quantity
                                            </th>
                                            <th className='w-1/12 min-w-[5rem] text-center font-semibold py-3 text-xs'>
                                                Unit
                                            </th>
                                            <th className='w-1/12 min-w-[6rem] text-center font-semibold py-3 text-xs'>
                                                Dimension
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-gray-00 '>
                                        {items.map((row, i) => (
                                            <ShipmentInputComponent
                                                key={i}
                                                handleItemDelete={handleItemDelete}
                                                setItems={setItems}
                                                row={row}
                                                i={i}
                                                items={items}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <div
                                    className='left-0 sticky py-2 mt-3 w-full 303131]  px-auto flex cursor-pointer justify-center items-center border-dashed border border-slate-400 p-1 rounded-lg bg-slate-50'
                                    onClick={() =>
                                        setItems([
                                            ...items,
                                            {
                                                name: "",
                                                weight: "",
                                                quantity: 0,
                                                unit: "",
                                                dimension: "",
                                            },
                                        ])
                                    }
                                >
                                    <HiPlus className='mr-2 text-base' />
                                    Add Item
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex mt-4 w-[95%] mb-3 justify-end'>
                {sendLoading ? (
                    <button className='bg-[#173fb8] 303131] w-full sm:max-w-fit p-2 px-6 justify-center text-white border-none rounded-lg text-sm'>
                        <Spin indicator={antIcon} />
                    </button>
                ) : (
                    <button
                        className='bg-[#173fb8] 303131] w-full sm:max-w-fit p-2 px-6 justify-center text-white border-none rounded-lg text-sm'
                        onClick={() => handleSubmit()}
                    >
                        Create Shipment
                    </button>
                )}
            </div>
        </>
    );
};

export default AddShipmentModal;
