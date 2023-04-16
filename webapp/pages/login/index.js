import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { LoginPage } from "../../components/Layout/middleware";
import axios from "axios";
import Cookies from "js-cookie";
import { storeUser } from "../../store/user";
import { useCookie } from "next-cookie";
import { BiWallet } from "react-icons/bi";

const Login = (props) => {
  const dispatch = useDispatch();
  const cookie = useCookie(props.cookie);
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState("");

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Got the ethereum obejct: ", ethereum);
    } else {
      console.log("No Wallet found. Connect Wallet");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log("Found authorized Account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      Cookies.set("currentAccount", accounts[0], { path: "" });
      // router.push("/");
    } else {
      console.log("No authorized account found");
    }
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);
  };

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      // const rinkebyChainId = "0x7A69";

      // if (chainId !== rinkebyChainId.toLowerCase()) {
      //   alert("You are not connected to the Rinkeby Testnet!");
      //   return;
      // }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
      Cookies.set("currentAccount", accounts[0], { path: "" });
      router.push("/");
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  // useEffect(() => {
  //   if (currentAccount) {
  //     router.push("/");
  //   }
  // }, [currentAccount]);

  useEffect(() => {
    (async () => {
      await checkIfWalletIsConnected();
      await checkCorrectNetwork();
    })();
  }, []);

  return (
    <div className="absolute z-50 bg-white left-0 top-0 flex h-screen w-screen">
      <Head>
        <title>Login</title>
      </Head>
      <div className="h-screen w-[60%] bg-[#F4F1E9] hidden flex-col justify-center items-center md:flex">
        <div className="absolute left-0 top-0 mt-8 ml-8 font-bold text-2xl">
          Easy<span className="text-[#063FED]">Ship</span>
        </div>
        <div className="relative">
          {/* <div className="absolute h-52 w-52 -top-4 -left-4 rounded-full bg-[#00227B]" /> */}
          <img src="/signInBg.png" className="w-[350px]" />
        </div>
        <div className="font-bold text-2xl mt-3">Shipping simplified</div>
        <div className="font-normal text-sm mt-2 text-center">
          Minimize processing time.
          <br />
          Maximize Transparency.
        </div>
      </div>

      <form className="h-screen w-full flex flex-col justify-center items-center md:w-[40%]">
        <img src="/metamask.png" className="w-[100px] mb-4" />
        {!currentAccount && (
          <button
            type="button"
            className="rounded-lg flex items-center bg-[#f1c232] py-3 px-10 text-base font-medium transition duration-500 ease-in-out hover:scale-105"
            onClick={connectWallet}
          >
            <BiWallet className="mr-3" />
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <div className="mb-10 rounded-lg bg-[#f1c232] py-3 px-12 text-2xl font-bold transition duration-500 ease-in-out hover:scale-105">
            {currentAccount.substring(0, 6) +
              "..." +
              currentAccount.substring(38)}
          </div>
        )}
        <div className="flex flex-col">
          <div
            onClick={() => router.push("/register")}
            className="flex justify-center text-center items-center text-xs cursor-pointer mt-5"
          >
            Facing any issues?
            <span className="text-[#063FED] ml-1">Contact Us</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps = LoginPage(async (_ctx) => {
  const cookie = useCookie(_ctx);
  return {
    props: {
      cookie: _ctx.req.headers.cookie || "",
    },
  };
});

export default Login;
