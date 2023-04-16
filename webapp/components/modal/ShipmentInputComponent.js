// import unitTypes from "@/components/data/unitTypes";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

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

const ShipmentInputComponent = ({ row, i, handleItemDelete, setItems, items }) => {
    const [change, setChange] = useState(false);

    return (
        <>
            <tr className=''>
                <td className='w-1/12 text-center pt-3 text-xs'>
                    <div className='flex items-center  justify-center relative'>
                        <MdDeleteOutline
                            className='text-sm text-red-500 mr-2 cursor-pointer absolute left-2'
                            onClick={() => handleItemDelete(i)}
                        />
                        {i + 1}
                    </div>
                </td>
                <td className='w-3/12 pt-3 text-xs'>
                    <input
                        type='text'
                        value={row.name}
                        onChange={(e) => {
                            let newArr = items;
                            newArr[i] = {
                                ...newArr[i],
                                name: e.target.value,
                            };
                            setItems([...newArr]);
                        }}
                        autoComplete='off'
                        placeholder='Name'
                        className='w-full h-6 relative z-0 items-center px-2 bg-[#EAF0F7] 303131]   rounded-sm outline-none flex'
                    />
                </td>
                <td className='w-1/12 text-center pt-3 px-1 text-xs'>
                    <input
                        type='text'
                        value={row.weight}
                        onChange={(e) => {
                            let newArr = items;
                            newArr[i] = {
                                ...newArr[i],
                                weight: String(e.target.value).toUpperCase(),
                            };
                            setItems([...newArr]);
                        }}
                        autoComplete='off'
                        placeholder={row.type === "Product" ? "HSN Code" : "SAC Code"}
                        className='w-full h-6 relative z-0 items-center px-2 bg-[#EAF0F7] 303131]   rounded-sm outline-none flex'
                    />
                </td>
                <td className='w-1/12 pt-3 px-1 text-xs'>
                    <input
                        type='text'
                        value={row.quantity}
                        onChange={(e) => {
                            let newArr = items;
                            newArr[i] = {
                                ...newArr[i],
                                quantity: String(e.target.value).toUpperCase(),
                            };
                            setItems([...newArr]);
                        }}
                        autoComplete='off'
                        placeholder={row.type === "Product" ? "HSN Code" : "SAC Code"}
                        className='w-full h-6 relative z-0 items-center px-2 bg-[#EAF0F7] 303131]   rounded-sm outline-none flex'
                    />
                </td>
                <td className='w-1/12 text-center pt-3 px-1 text-xs'>
                    <input
                        type='text'
                        value={row.unit}
                        onChange={(e) => {
                            let newArr = items;
                            newArr[i] = {
                                ...newArr[i],
                                unit: e.target.value,
                            };
                            setItems([...newArr]);
                        }}
                        autoComplete='off'
                        placeholder='items'
                        className='w-full h-6 relative z-0 items-center px-2 bg-[#EAF0F7] 303131]   rounded-sm outline-none flex'
                    />
                </td>
                <td className='w-1/12 text-center pt-3 px-1 text-xs'>
                    <input
                        type='text'
                        value={row.dimension}
                        onChange={(e) => {
                            let newArr = items;
                            newArr[i] = {
                                ...newArr[i],
                                dimension: e.target.value,
                            };
                            setItems([...newArr]);
                        }}
                        autoComplete='off'
                        placeholder='12x12x13'
                        className='w-full h-6 relative z-0 items-center px-2 bg-[#EAF0F7] 303131]   rounded-sm outline-none flex'
                    />
                </td>
            </tr>
        </>
    );
};

export default ShipmentInputComponent;
