
import axios from "axios";

const adminApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
});

// Attach admin access token to every request (namespaced key)
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const forceAdminLogout = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  if (window.location.pathname !== '/auth') {
    // replace() instead of href: no history entry, no back-button bounce
    window.location.replace('/auth');
  }
};

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return adminApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("adminRefreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        forceAdminLogout();
        return Promise.reject(error);
      }

      try {
        // bare axios so this call doesn't re-trigger the interceptor
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/admin/refresh-token`,
          { refreshToken }
        );

        localStorage.setItem("adminAccessToken", data.accessToken);
        localStorage.setItem("adminRefreshToken", data.refreshToken);

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceAdminLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;