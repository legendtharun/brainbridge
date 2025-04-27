import serverConfig from "../server.config";

export const isTokenValid = async (token) => {
  if (!token) return false;

  try {
    const response = await fetch(
      `${serverConfig.serverAddress}/protected-route`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // If the response is ok (status 200-299), return true

    if (response.ok) {
      return true;
    } else {
      // Handle the case when the token is invalid (e.g., status 401 or 403)
      return false;
    }
  } catch (error) {
    // Handle network or server errors
    console.error("Error verifying token:", error);
    return false;
  }
};
