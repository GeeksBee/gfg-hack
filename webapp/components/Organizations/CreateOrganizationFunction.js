import axios from "axios";
import Cookies from "js-cookie";

export const CreateOrganizationFunction = async (organizationObj) => {
  try {
    const { data } = await axios.patch("/organisation", organizationObj, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
        Cookies: `accessToken=${Cookies.get("accessToken")}`,
      },
      crossDomain: true,
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
