const BASE_URL = "http://localhost:3000/api";

const request = async (method, path, body = null, isFormData = false) => {
  const options = {
    method,
    credentials: "include", // sends JWT cookie
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Auth APIs
export const registerUser = (payload) => request("POST", "/auth/register", payload);
export const loginUser = (payload) => request("POST", "/auth/login", payload);
export const logoutUser = () => request("POST", "/auth/logout");

// Music APIs
export const uploadMusic = (formData) => request("POST", "/music/upload", formData, true);
export const getAllMusics = () => request("GET", "/music/");

// Album APIs
export const createAlbum = (payload) => request("POST", "/music/album", payload);
export const getAllAlbums = () => request("GET", "/music/albums");
export const getAlbumById = (albumId) => request("GET", `/music/albums/${albumId}`);
