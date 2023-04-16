import cookie from "cookie";

export function ProtectedPage(gssp) {
  return async (ctx) => {
    const { req } = ctx;
    // return await gssp(ctx);

    const hCookie = req.headers.cookie;

    if (hCookie) {
      const { currentAccount } = cookie.parse(hCookie);

      if (currentAccount) {
        return await gssp(ctx);
      } else {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
  };
}

export function LoginPage(gssp) {
  return async (ctx) => {
    const { req } = ctx;
    // return await gssp(ctx);

    const hCookie = req.headers.cookie;

    if (hCookie) {
      const { currentAccount } = cookie.parse(hCookie);

      if (currentAccount) {
        // return {
        //   redirect: {
        //     permanent: false,
        //     destination: "/",
        //   },
        // };
        return await gssp(ctx);
      } else {
        return await gssp(ctx);
      }
    } else {
      return await gssp(ctx);
    }
  };
}
