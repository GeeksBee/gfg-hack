import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import Image from "next/image";
import { ProtectedPage } from "../../components/Layout/middleware";
// import { Image as CloudinaryImage } from "cloudinary-react";
// import { storeProducts } from "@/slices/user";
import { Skeleton } from "antd";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";
import { MdClear } from "react-icons/md";
// import { UnitsKeyValue } from "@/components/data/unitTypes";
import { useRouter } from "next/router";
// import { handleToggle } from "services/lib/products";
import { RiWhatsappFill } from "react-icons/ri";
import dynamic from "next/dynamic";
import Navbar from "../../components/Layout/Navbar";
import { HiLocationMarker } from "react-icons/hi";
import AddShipmentModal from "../../components/modal/AddShipmentModal";

// const AddProductModal = dynamic(() =>
//   import("@/components/modals/AddProductModal")
// );
// const ToggleSwitch = dynamic(() => import("@/components/buttons/ToggleSwitch"));

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const { selectedBusiness, products, selectedBusinessIndex } = useSelector(
    (state) => state.user
  );

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebounce(query, 500);

  const handleStockToggle = async (index) => {
    try {
      const { data } = await handleToggle(products[index].id, {
        inStock: !products[index]?.inStock,
        businessId: selectedBusiness.businessId,
      });
      const newArr = [...products];
      newArr[index] = data.product;
      // dispatch(storeProducts(newArr));
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisibleToggle = async (index) => {
    try {
      const { data } = await handleToggle(products[index].id, {
        visible: !products[index]?.visible,
        businessId: selectedBusiness.businessId,
      });
      const newArr = [...products];
      newArr[index] = data.product;
      // dispatch(storeProducts(newArr));
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductShare = async (e) => {
    e.stopPropagation();

    const response = await fetch(
      "https://res.cloudinary.com/produx/image/upload/v1659224181/products/w5p52urcs5cbzi0z85k6"
    );
    const blob = await response.blob();
    const file = new File([blob], "share.jpg", { type: blob.type });
    console.log(file);
    if (navigator.share) {
      await navigator
        .share({
          title: "title",
          text: "your text",
          url: "url to share",
          files: [file],
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error in sharing", error));
    } else {
      console.log(`system does not support sharing files.`);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // dispatch(storeProducts(res.data.products));
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
            headerName="Shipments"
            showBack={addProductModalOpen}
            handleBack={() => setAddProductModalOpen((prev) => !prev)}
          />

          <div className="w-[95%] flex">
            <button
              className={`flex z-10 bg-[#173fb8] px-5 border-none p-2 fixed sm:static bottom-4 right-4 items-center rounded-lg text-sm text-white ${
                addProductModalOpen && "hidden lg:block"
              }`}
              onClick={() => setAddProductModalOpen((prev) => !prev)}
            >
              {!addProductModalOpen ? "Add Shipment" : "Cancel"}
            </button>

            {!addProductModalOpen && (
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

          {!addProductModalOpen ? (
            <div
              className={`w-[95%] sm:p-10 my-4 sm:h-[80vh] h-full rounded-2xl sm:shadow-4xl sm:1F1E1F] flex flex-col items-center sm:overflow-scroll overflow-visible`}
            >
              {loading ? (
                <div className="w-full">
                  {Array(4)
                    .fill(1)
                    .map((e, i) => (
                      <div
                        key={i}
                        className="w-full text-sm rounded-xl flex flex-col sm:flex-row p-6 mb-4 last:mb-0 shadow-4xl border-[#f0f0f0]"
                      >
                        <div className="flex justify-center sm:justify-start items-center sm:mr-2">
                          <Skeleton.Image active={true} />
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base opacity-70 mt-3 sm:mt-0 font-medium">
                            <Skeleton.Input
                              active={true}
                              size="small"
                              block={true}
                            />
                          </div>

                          <div className="flex mt-3 opacity-60 items-center text-xs">
                            <div className="opacity-90 text text-sm">
                              <Skeleton.Input
                                active={true}
                                size="small"
                                block={true}
                              />
                            </div>
                            <div className="opacity-80 text line-through ml-3 text-xs">
                              <Skeleton.Input
                                active={true}
                                size="small"
                                block={true}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap">
                            {Array(2)
                              .fill(1)
                              .map((ele, i) => (
                                <Skeleton.Button
                                  key={i}
                                  active={true}
                                  size="small"
                                  className="mr-1"
                                />
                              ))}
                          </div>
                        </div>
                        <div className="sm:ml-auto mt-3 sm:mt-0 h-full items-start sm:items-end justify-between flex flex-col">
                          <div className="opacity-80 text-xs flex flex-col items-end sm:mb-2 text-right">
                            <Skeleton.Input
                              active={true}
                              size="small"
                              block={true}
                            />
                          </div>
                          <div className="flex sm:flex-col mt-1">
                            <div className="mt-auto flex items-center justify-between">
                              <div className="opacity-60 mr-3 text-sm">
                                <Skeleton.Button
                                  active
                                  size="default"
                                  shape="round"
                                  block={true}
                                />
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between ml-6 sm:ml-0">
                              <div className="opacity-60 mr-3 text-sm">
                                <Skeleton.Button
                                  active
                                  size="default"
                                  shape="round"
                                  block={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="p-6 sm:p-0" />
                </div>
              ) : !loading && products?.length === 0 ? (
                <div className="h-[90%] flex flex-col items-center justify-center -mt-5">
                  <Image
                    alt="Empty"
                    src={"/empty.webp"}
                    height={200}
                    width={200}
                  />
                  <div className="text-base text-gray-600 font-medium flex items-center -mt-1">
                    No Products Found
                  </div>
                  <div className="text-xs text-gray-500 flex items-center w-[200px] text-center mt-1">
                    Try adding new product to gain your customers
                  </div>
                </div>
              ) : (
                [1, 1, 1, 1]?.map((ele, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/products/${i}`)}
                    className="w-full relative text-sm rounded-xl flex flex-col sm:flex-row p-5 mb-4 last:mb-0 shadow-4xl border-[#f0f0f0] 303131] cursor-pointer"
                  >
                    <div className="h-full flex justify-center sm:justify-start mb-2 sm:mb-0 items-center sm:mr-4"></div>

                    <div className="flex flex-col my-auto">
                      <div className="text-lg opacity-70 font-medium">
                        Container<span className="ml-[2px] text-sm">#213</span>
                      </div>

                      <div className="flex mt-1 opacity-60 items-center text-sm">
                        Status :
                        <div className="flex mb-1 ml-2 items-center w-fit justify-center p-[2px] px-[10px] text-xs rounded-[3px] mr-2 bg-orange-600 text-white">
                          Pending
                        </div>
                        <div className="flex mb-1 ml-2 items-center w-fit justify-center p-[2px] px-[10px] text-xs rounded-[3px] mr-2 bg-red-600 text-white">
                          Cancelled
                        </div>
                        <div className="flex mb-1 ml-2 items-center w-fit justify-center p-[2px] px-[10px] text-xs rounded-[3px] mr-2 bg-green-600 text-white">
                          Completed
                        </div>
                      </div>

                      <div className="mt-1 text-xs opacity-70 -300">
                        Current location : At Port DKKFHJ, Recieved 10:20 AM
                      </div>
                    </div>

                    <div className="sm:ml-auto sm:mt-0 h-full content-between justify-between flex">
                      <div className="flex flex-col justify-between py-1">
                        <div
                          className="flex items-end flex-col justify-center mr-2 bg-white -800  sm:mr-0 pt-[2px] px-2 "
                          onClick={(e) => handleProductShare(e)}
                        >
                          <text className="text-xs">Panaji, Goa, India</text>
                          <text className="text-[10px] -mt-1">
                            12:00 AM, 24th Aug 2022
                          </text>
                        </div>

                        <div
                          className="flex items-end flex-col justify-center mr-2 bg-white -800  sm:mr-0 pt-[2px] px-2 "
                          onClick={(e) => handleProductShare(e)}
                        >
                          <text className="text-xs">Dublin, GA, USA</text>
                          <text className="text-[10px] -mt-1">
                            ETA: 12:00 AM, 24th Nov 2022
                          </text>
                        </div>
                      </div>

                      <div>
                        <div className="flex sm:flex-col mt-1 items-end">
                          <div
                            className="flex items-center justify-center mr-2 bg-white -800  sm:mr-0 p-1 px-2 "
                            onClick={(e) => handleProductShare(e)}
                          >
                            <HiLocationMarker className="text-lg text-gray-500 ml-2" />
                          </div>

                          <div className="border border-dashed h-7 w-[1px] -py-3 mr-4" />

                          <div
                            className="flex items-center justify-center mr-2 bg-white -800  sm:mr-0 p-1 px-2 "
                            onClick={(e) => handleProductShare(e)}
                          >
                            <HiLocationMarker className="text-lg text-gray-500 ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="p-6 sm:p-0" />
            </div>
          ) : (
            <AddShipmentModal setShowModal={setAddProductModalOpen} />
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

export default Products;
