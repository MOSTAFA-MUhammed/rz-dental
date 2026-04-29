const skeletons = Array.from({ length: 6 }, (_, index) => index);

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-4">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-12 w-80 max-w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {skeletons.map((item) => (
          <div
            key={item}
            className="h-[380px] animate-pulse rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_60px_rgba(15,23,42,0.08)]"
          />
        ))}
      </div>
    </main>
  );
}
