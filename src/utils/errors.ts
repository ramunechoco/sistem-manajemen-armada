import { isAxiosError } from 'axios'
import type { JsonApiErrorResponse } from '@/types/api'

export interface ErrorInfo {
  title: string
  message: string
}

export function getErrorInfo(error: unknown): ErrorInfo {
  if (!isAxiosError<JsonApiErrorResponse>(error)) {
    return {
      title: 'Terjadi kesalahan',
      message: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
    }
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      title: 'Waktu permintaan habis',
      message: 'Server terlalu lama merespons. Silakan coba lagi.',
    }
  }

  const status = error.response?.status

  if (status === undefined) {
    return {
      title: 'Tidak dapat terhubung',
      message: 'Periksa koneksi internet Anda, lalu coba lagi.',
    }
  }

  switch (status) {
    case 400:
      return {
        title: 'Permintaan tidak valid',
        message: error.response?.data?.errors?.[0]?.detail ?? 'Parameter permintaan tidak valid.',
      }
    case 403:
      return {
        title: 'Akses ditolak',
        message: 'Server menolak permintaan. API key mungkin tidak valid.',
      }
    case 404:
      return {
        title: 'Data tidak ditemukan',
        message: 'Data yang diminta tidak tersedia.',
      }
    case 429:
      return {
        title: 'Terlalu banyak permintaan',
        message: 'Batas permintaan ke server tercapai. Tunggu sebentar lalu coba lagi.',
      }
  }

  if (status >= 500) {
    return {
      title: 'Server sedang bermasalah',
      message: 'Server MBTA sedang mengalami gangguan. Silakan coba beberapa saat lagi.',
    }
  }

  return {
    title: 'Permintaan gagal',
    message: `Server merespons dengan kode ${status}. Silakan coba lagi.`,
  }
}
