import axios from "axios";
import Cookies from "js-cookie";

export const submitJobFunction = async (createJobObj) => {
  console.log({ createJobObjATSUB: createJobObj });
  try {
    const { data } = await axios.post("/job", createJobObj, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
        Cookies: `accessToken=${Cookies.get("accessToken")}`,
      },
      crossDomain: true,
    });
    console.log(data);
  } catch (error) {}
};
