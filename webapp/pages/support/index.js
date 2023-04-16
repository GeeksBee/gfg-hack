import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { BiSearch } from "react-icons/bi";
// import { ProtectedPage } from "../../middleware";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { MdClear } from "react-icons/md";
import Image from "next/image";
// import { storeOrders } from "slices/user";
import axios from "axios";
import dynamic from "next/dynamic";
import Navbar from "../../components/Layout/Navbar";
import { ProtectedPage } from "../../components/Layout/middleware";

// const AddOrderModal = dynamic(() =>
//   import("@/components/modals/AddOrderModal")
// );

const statusTags = [
  {
    type: "Unpaid",
    color: "#DF4E4E",
    bgColor: "#FFEBEB",
  },
  {
    type: "Partially Paid",
    color: "#DFA34E",
    bgColor: "#FFF7EB",
  },
  {
    type: "Paid",
    color: "#4BAD74",
    bgColor: "#F4FEF7",
  },
  // {
  //   type: "Delivered",
  //   color: "#5A89B5",
  //   bgColor: "#F0F8FF",
  // },
];

const getStatusIndex = (total, paid) => {
  if (paid === 0) return 0;
  else if (paid >= total) return 2;
  else return 1;
};

const Orders = () => {
  const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
  const { selectedBusiness, orders, selectedBusinessIndex } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebounce(query, 500);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // const res = await axios.post(
        //   `/api/admin/orders/${selectedBusiness.businessId}`,
        //   {
        //     page,
        //     query: debouncedSearch,
        //   }
        // );
        // dispatch(storeOrders(res.data.orders));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [
    selectedBusiness,
    selectedBusinessIndex,
    debouncedSearch,
    dispatch,
    page,
  ]);

  return (
    <div>
      <Head>
        <title>EasyShip</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <main>
        <div className="flex items-center flex-col">
          <Navbar headerName="Support" />

          <div className="w-[95%] h-[80vh] mx-auto">
            <div className="p-3 rounded-2xl h-full shadow-4xl flex flex-col justify-center items-center 1F1E1F] my-4 mt-6 w-full m-auto overflow-x-scroll">
              <img src="/construction.png" className="w-[200px]" />
              <div className="text-center mt-3 font-medium ml-5 flex justify-center">
                Under Construction
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = ProtectedPage(async (_ctx) => {
  return {
    props: {},
  };
});

export default Orders;
