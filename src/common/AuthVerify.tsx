import { getUser, setUser } from "../redux/user.action";
import { updateUser } from "../service/users.service";
import Logout from "./Logout";

export default function AuthVerify(options?: { isAdmin?: boolean }) {
  const user = getUser();
  if (Object.keys(user).length === 0) {
    return Logout();
  }
  if (user.active !== true) {
    return Logout();
  }

  if (user.token) {
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    if (exp > now) {
      if (!user.checked) {
        updateUser({}).then((response) => {
          setUser(response.data);
          if (
            !response.data.checked &&
            window.location.pathname !== "/settings"
          ) {
            window.location.href = "/settings";
          }
        });
      }
      if (options?.isAdmin && user.roles.includes("admin") === false) {
        window.location.href = "/";
      }
      return;
    }
  }
  return Logout();
}

/*
import { Buffer } from "buffer";
import { getUser, setUser } from "../redux/user.action";
import { updateUser } from "../service/users.service";
import Logout from "./Logout";

export default function AuthVerify(options?: { isAdmin?: boolean }) {
  const user = getUser();
  if (Object.keys(user).length === 0) {
    return Logout();
  }
  if (user.active !== true) {
    return Logout();
  }

  if (user.token) {
    const payload = JSON.parse(
      Buffer.from(user.token.split(".")[1], "base64").toString()
    );
    const exp = payload.exp * 1000;
    const now = Date.now();
    if (exp > now) {
      if (!user.checked) {
        updateUser({}).then((response) => {
          setUser(response.data);
          if (
            !response.data.checked &&
            window.location.pathname !== "/settings"
          ) {
            window.location.href = "/settings";
          }
        });
      }
      if (options?.isAdmin && user.roles.includes("admin") === false) {
        window.location.href = "/";
      }
      return;
    }
  }
  return Logout();
}

*/
