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
  //   const apiUrl = "http://localhost:8080/api/port";
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/port`;
  const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
  const { selectedBusiness, orders, selectedBusinessIndex } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const [ports, setPorts] = useState([]);

  const debouncedSearch = useDebounce(query, 500);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiUrl, {
          withCredentials: true,
          headers: {
            "content-type": "application/json",
          },
        });
        setPorts(res.data.filter((item, i) => i < 40));
        console.log(res.data);
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
          <Navbar
            headerName="Ports"
            showBack={addOrderModalOpen}
            handleBack={() => setAddOrderModalOpen((prev) => !prev)}
          />
          <div className="w-[95%] flex">
            <button
              className={`flex z-10 bg-[#173fb8] 303131] px-5 border-none p-2 fixed sm:static bottom-4 right-4 items-center rounded-lg text-sm text-white ${
                addOrderModalOpen && "hidden lg:block"
              }`}
              onClick={() => setAddOrderModalOpen((prev) => !prev)}
            >
              {!addOrderModalOpen ? "Add Port" : "Cancel"}
            </button>

            {!addOrderModalOpen && (
              <div className="sm:p-[6px] px-3 rounded-md border p-2 ml-auto w-full sm:w-64 flex items-center">
                <BiSearch className="text-xl mx-2 " />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex w-full outline-none bg-transparent  "
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query.length > 0 && (
                  <MdClear
                    className="text-xl mx-2 cursor-pointer "
                    onClick={() => setQuery("")}
                  />
                )}
              </div>
            )}
          </div>

          {!addOrderModalOpen ? (
            <div className="w-full">
              <div className="w-[95%] mx-auto">
                {/* <Tabs
                  defaultActiveKey="1"
                  onChange={callback}
                  className="-400"
                >
                  <TabPane tab="All" key="1" className=""> */}
                <div className="p-3 rounded-2xl shadow-4xl 1F1E1F] my-4 mt-6 w-full m-auto overflow-x-scroll">
                  {!loading && orders?.length === 0 ? (
                    <div className="h-[80vh] flex flex-col items-center justify-center -mt-5">
                      <Image
                        alt="Empty"
                        src={"/empty.webp"}
                        height={200}
                        width={200}
                      />
                      <div className="text-base text-gray-600 font-medium flex items-center -mt-1">
                        No Orders Found
                      </div>
                      <div className="text-xs text-gray-500 flex items-center w-[200px] text-center mt-1">
                        Creating & sending invoices to customers made easy
                      </div>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-100  303131] rounded-2xl">
                        <tr className="rounded-lg">
                          <th className="w-2/12 text-center  py-3 px-4 text-xs font-semibold rounded-l-lg">
                            Index
                          </th>
                          <th className="w-2/12 text-center  py-1 px-4 text-xs font-semibold">
                            Name
                          </th>
                          <th className="w-2/12 text-center  py-1 px-4 font-semibold text-xs">
                            Code
                          </th>
                          <th className="w-6/12 text-center  py-1 px-4 font-semibold text-xs rounded-r-lg">
                            Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-00 ">
                        {loading
                          ? Array(6)
                              .fill(1)
                              .map((row, i) => (
                                <>
                                  <tr
                                    className="py-5 border-b-[1px] last:border-0 303131]"
                                    key={i}
                                  >
                                    <td className="w-2/12 text-center py-3 px-4 pl-8 text-xs">
                                      <Skeleton.Button
                                        key={i}
                                        active={true}
                                        size="small"
                                        className="mr-1"
                                      />
                                    </td>
                                    <td className="w-2/12 text-center py-3 px-4 text-xs">
                                      <Skeleton.Input
                                        active={true}
                                        size="small"
                                        className="mr-1"
                                      />
                                    </td>
                                    <td className="w-2/12 text-center py-3 px-4 text-xs">
                                      <Skeleton.Input
                                        active={true}
                                        size="small"
                                        className="mr-1"
                                      />
                                    </td>
                                    <td className="w-6/12 text-center py-3 px-4 text-xs">
                                      <Skeleton.Input
                                        active={true}
                                        size="small"
                                        className="mr-1"
                                      />
                                    </td>
                                  </tr>
                                </>
                              ))
                          : ports.slice(10).map((port, i) => (
                              <tr className="303131]" key={i}>
                                <td className="w-2/12 min-w-[7rem] text-center  py-3 px-4 text-xs">
                                  {i + 1}
                                </td>
                                <td className="w-2/12 min-w-[10rem] text-center  py-3 px-4 text-xs">
                                  {port.name}
                                </td>
                                <td className="w-2/12 min-w-[10rem] text-center  py-3 px-4 text-xs">
                                  {port.code}
                                </td>
                                <td className="w-6/12 min-w-[8rem] text-left  py-3 px-4 text-xs">
                                  {`${port.city}, ${port.country}`}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div className="p-6 sm:p-0" />
            </div>
          ) : (
            <div className="w-[95%] h-[70vh] mx-auto">
              <div className="p-3 rounded-2xl h-full shadow-4xl flex flex-col justify-center items-center 1F1E1F] my-4 mt-6 w-full m-auto overflow-x-scroll">
                <img src="/construction.png" className="w-[200px]" />
                <div className="text-center mt-3 font-medium ml-5 flex justify-center">
                  Under Construction
                </div>
              </div>
            </div>
            // <AddOrderModal setShowModal={setAddOrderModalOpen} />
          )}
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
