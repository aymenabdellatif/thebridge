import axios from 'axios';
import { useAuth } from '../context/AuthContext';
export function useApi() {
  const { token } = useAuth();
  return axios.create({ baseURL: '/api', headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
