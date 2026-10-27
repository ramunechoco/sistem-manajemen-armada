function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold">Sistem Manajemen Armada</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section
          aria-label="Filter kendaraan"
          className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-400"
        >
          Filter Rute &amp; Trip
        </section>

        <section
          aria-label="Daftar kendaraan"
          className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-400"
        >
          Daftar kendaraan
        </section>
      </main>
    </div>
  )
}

export default App
