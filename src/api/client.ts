import axios from 'axios'
import { API_BASE_URL, API_KEY } from '@/constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: API_KEY ? { 'x-api-key': API_KEY } : {},
})
