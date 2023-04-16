import Head from "next/head";
import { useSelector } from "react-redux";
import { AiOutlineFundView } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { GrServices } from "react-icons/gr";
import {
  RiFacebookFill,
  RiSuitcaseLine,
  RiWhatsappLine,
  RiInstagramLine,
  RiTwitterLine,
} from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { FiCopy } from "react-icons/fi";
// import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Layout/Navbar";
import { BiListCheck, BiListPlus } from "react-icons/bi";

import { ProtectedPage } from "./../components/Layout/middleware";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const { isModeDark } = useSelector((state) => state.choices);
  const { selectedBusinessIndex, selectedBusiness, businesses, user } =
    useSelector((state) => state.user);

  const [url, setUrl] = useState(
    `https://produx.co.in/b/${
      selectedBusiness?.businessId
    }/${selectedBusiness?.business?.name
      ?.toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")}`
  );
  const ref = useRef(null);

  return (
    <div>
      <Head>
        <title>GeeksBee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={`flex items-center flex-col ${isModeDark && "dark"}`}>
          <Navbar headerName="Dashboard" />

          <div className="w-[95%] lg:h-[85vh] overflow-hidden flex flex-col lg:flex-row justify-between sm:mt-5">
            <div className="flex lg:w-[60%] flex-col">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between">
                <div className="sm:w-[23%] min-h-max relative overflow-hidden bg-[#EFFDEE] flex flex-col rounded-xl p-5">
                  <BiListCheck className="text-5xl" />
                  <div className="mt-auto text-sm font-medium">
                    Total Shipments
                  </div>
                  <div className=" font-medium text-2xl">32</div>
                  <div className="h-20 w-20 rounded-full absolute bg-[#80CD87] -bottom-6 -right-6" />
                </div>

                <div className="sm:w-[23%] min-h-max relative overflow-hidden bg-[#F5F7FA] flex flex-col rounded-xl p-5">
                  <BiListPlus className="text-4xl mt-1" />
                  <div className="mt-auto text-sm font-medium">Shipped</div>
                  <div className=" font-medium text-2xl">22</div>
                  <div className="h-20 w-20 rounded-full absolute bg-[#161717] -bottom-6 -right-6" />
                </div>

                <div className="sm:w-[23%] min-h-max relative overflow-hidden bg-[#FEEFE3] flex flex-col rounded-xl p-5">
                  <BsBoxSeam className="text-4xl mt-1" />
                  <div className="mt-auto text-sm font-medium">Recieved</div>
                  <div className=" font-medium text-2xl">5</div>
                  <div className="h-20 w-20 rounded-full absolute bg-[#C98E65] -bottom-6 -right-6" />
                </div>

                <div className="sm:w-[23%] min-h-max relative overflow-hidden bg-[#E7F4F9] flex flex-col rounded-xl p-5">
                  <GrServices className="text-4xl mt-1" />
                  <div className="mt-10 text-sm font-medium">Pending</div>
                  <div className=" font-medium text-2xl">5</div>
                  <div className="h-20 w-20 rounded-full absolute bg-[#88C2D4] -bottom-6 -right-6" />
                </div>
              </div>

              <div className="w-full h-full flex flex-grow mt-5 sm:mt-10 p-4 py-8 bg-[#fbfaff] rounded-xl">
                <Line
                  data={{
                    labels: [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                    ],
                    // labels: Utils.months({ count: 7 }),
                    datasets: [
                      {
                        label: "Shipments",
                        data: [23, 26, 60, 81, 66, 65, 78],
                        // fill: true,
                        borderColor: "#5945F7",
                        // backgroundColor: "rgba(255, 159, 64, 0.2)",
                        tension: 0.4,
                      },
                      {
                        label: "Completed",
                        data: [21, 43, 54, 23, 67, 54, 98],
                        // fill: true,
                        // backgroundColor: "rgba(255, 159, 64, 0.2)",
                        borderColor: "black",
                        tension: 0.4,
                      },
                    ],
                  }}
                  height={300}
                  width={600}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    legend: {
                      labels: {
                        fontSize: 25,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col lg:w-[36%] my-5 lg:my-0 h-max items-center bg-[#FAF9F5] rounded-lg p-5">
              {/* <div
                onClick={() => onDownloadClick()}
                className="bg-[#E2E1D3] cursor-pointer rounded-sm flex justify-center mt-5 p-2"
                ref={ref}
              /> */}
              <div className="mt-2 text-md font-medium ">Learn More</div>
              <div
                onClick={async () => {
                  if ("clipboard" in navigator) {
                    await navigator.clipboard.writeText(
                      `https://easyship.com/b/${"blog/learnmore"}/}`
                    );
                    // return toast.success("Successfully copied to clipboard!");
                  } else {
                    document.execCommand(
                      "copy",
                      true,
                      `https://produx.co.in/b/${"nlog/learnmore"}/}`
                    );
                    // return toast.success("Successfully copied to clipboard!");
                  }
                }}
                className="bg-[#E2E1D3] cursor-pointer h-9 w-[80%] flex items-center rounded-md mt-3 px-3 py-2"
              >
                <div className="overflow-hidden text-ellipsis text-xs">
                  {`https://produx.co.in/b/${"blog/learnmore"}/`}
                </div>
                <div className="w-9 flex justify-end items-center ml-auto text-base">
                  <FiCopy className="" />
                </div>
              </div>

              <div className="text-[#734f37] mt-4 text-xs">
                Share your business on
              </div>

              <div className="mt-1 flex w-[80%] justify-center">
                <div className="text-[#7d5d47] text-lg flex justify-center items-center mx-1 cursor-pointer bg-[#E2E1D3] h-9 w-9 rounded-full">
                  <RiWhatsappLine />
                </div>
                <div className="text-[#7d5d47] text-lg flex justify-center items-center mx-1 cursor-pointer bg-[#E2E1D3] h-9 w-9 rounded-full">
                  <RiFacebookFill />
                </div>
                <div className="text-[#7d5d47] text-lg flex justify-center items-center mx-1 cursor-pointer bg-[#E2E1D3] h-9 w-9 rounded-full">
                  <RiTwitterLine />
                </div>
                <div className="text-[#7d5d47] text-lg flex justify-center items-center mx-1 cursor-pointer bg-[#E2E1D3] h-9 w-9 rounded-full">
                  <RiInstagramLine />
                </div>
              </div>

              <hr className="border-[1px] w-full my-3 border-[#734f37]" />

              <div className="flex flex-col flex-grow w-full">
                <div className="font-medium">Notifications</div>
                <div className="overflow-scroll mt-1">
                  {Array(1)
                    .fill(1)
                    .map((ele, i) => (
                      <div
                        key={i}
                        className="flex p-2 cursor-pointer bg-[#E2E1D3] rounded-md mb-1 last:mb-0 mr-1"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#734f37] mr-3"></div>
                        <div>
                          <div>Complete your profile</div>
                          <div className="text-xs">Complete your profile</div>
                        </div>
                      </div>
                    ))}
                  {Array(1)
                    .fill(1)
                    .map((ele, i) => (
                      <div
                        key={i}
                        className="flex p-2 cursor-pointer bg-[#E2E1D3] rounded-md mb-1 last:mb-0 mr-1"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#734f37] mr-3"></div>
                        <div>
                          <div>2 times the Export Quatity</div>
                          <div className="text-xs">
                            Read these 15 points to double ..
                          </div>
                        </div>
                      </div>
                    ))}
                  {Array(1)
                    .fill(1)
                    .map((ele, i) => (
                      <div
                        key={i}
                        className="flex p-2 cursor-pointer bg-[#E2E1D3] rounded-md mb-1 last:mb-0 mr-1"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#734f37] mr-3"></div>
                        <div>
                          <div>Maintain Quality Standards</div>
                          <div className="text-xs">
                            Lead to keep up with the global need for quality
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = ProtectedPage(async (_ctx) => {
  return {
    props: {},
  };
});

export default Home;
