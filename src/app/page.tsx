export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface text-[#1F2937]">
      <div className="text-center space-y-4 p-8">
        <div className="flex gap-3 justify-center">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-electricity text-white">
            Electricity
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-water text-white">
            Water
          </span>
        </div>
        <h1 className="text-4xl font-bold text-primary">
          Engineering Solutions
        </h1>
        <p className="text-muted text-lg">Tanzania · Coming Soon</p>
        <p className="text-sm text-muted mt-8">Step 1 ✓ — running in Docker</p>
      </div>
    </main>
  );
}
