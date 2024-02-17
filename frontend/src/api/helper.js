import config from "../config";

export const AuthRoles = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  USER: "USER",
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("token") && localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};

export const isAdmin = () => {
  if (isAuthenticated() && isAuthenticated().role === AuthRoles.ADMIN) {
    return true;
  }
  return false;
};

export const isModerator = () => {
  if (isAuthenticated() && isAuthenticated().role === AuthRoles.MODERATOR) {
    return true;
  }
  return false;
};

export const requiredRoles = (roles) => {
  if (isAuthenticated() && roles.includes(isAuthenticated().role)) {
    return true;
  }
  return false;
};

export const signOut = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    next();

    return fetch(`${config.API_URL}/auth/logout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("signout", response);
      })
      .catch((err) => console.log(err));
  }
};
