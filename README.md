# Sistem Manajemen Armada

## Arsitektur aplikasi

Aplikasi dibangun dengan TypeScript, Vite, dan React 19. Library utama: TanStack Query (fetching dan cache), Axios (HTTP client), Tailwind CSS (styling), react-select (dropdown filter), dan React Leaflet (peta).

Kode di `src/` dibagi per lapisan:

```
src/
├── api/         Request ke MBTA API dan konversi respons JSON:API ke objek sederhana
├── hooks/       Hook React Query (useVehicles, useRoutes, useTrips, ...) dan state pagination
├── components/  Komponen UI: kartu, grid, filter, pagination, popup detail, peta
├── types/       Tipe TypeScript untuk respons API dan data aplikasi
└── utils/       Format teks/waktu dan pesan error
```

Data flow: komponen → hook → fungsi `api/` → MBTA API. Hasil request disimpan di cache React Query

## Cara menjalankan aplikasi

1. Pastikan Node.js versi 20.19+ atau 22.12+ sudah terpasang.
2. Clone repo dan install dependency:

   ```bash
   git clone <url-repo>
   cd sistem-manajemen-armada
   npm install
   ```

3. Salin `.env.example` menjadi `.env`. `VITE_API_KEY` boleh dikosongkan. Tanpa API key, MBTA API tetap bisa dipakai, tetapi jumlah request dibatasi. API key bisa didapat gratis di https://api-v3.mbta.com.

4. Jalankan server development:

   ```bash
   npm run dev
   ```

   Buka http://localhost:5173 di browser.

   Build untuk production:

   ```bash
   npm run build
   npm run preview
   ```
