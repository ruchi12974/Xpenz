
export const BASE_URL = "https://xpenz-3cex.onrender.com/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  EXPENSES: {
    BASE: `${BASE_URL}/expenses`,
    DETAIL: (id) => `${BASE_URL}/expenses/detail/${id}`,
    SINGLE: (id) => `${BASE_URL}/expenses/${id}`,
  }
}; 