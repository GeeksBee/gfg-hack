import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import OutsideClickHandler from "react-outside-click-handler";
import { setShowSidebar } from "../../store/choices";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const { showSidebar } = useSelector((state) => state.choices);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (
    router.pathname === "/login" ||
    router.pathname === "/forgot-password" ||
    router.pathname === "/forgot-password/[key]/[content]"
  ) {
    return children;
  }

  return (
    <div className="flex min-h-screen">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <div className="hidden lg:block w-2/12">
        <Sidebar />
      </div>
      {showSidebar && (
        <div className="fixed h-screen z-20 backdrop-blur-sm w-screen">
          <OutsideClickHandler
            onOutsideClick={() => dispatch(setShowSidebar(!showSidebar))}
          >
            <div className="fixed">
              <Sidebar />
            </div>
          </OutsideClickHandler>
        </div>
      )}
      <div className="w-full relative lg:w-10/12">{children}</div>

      {/* <div className="lg:block lg:w-2/12 xs:w-full xs:absolute">
        <Sidebar />
      </div>
      <div className="lg:w-10/12 xs:w-full">{children}</div> */}
    </div>
  );
};

export default Layout;
