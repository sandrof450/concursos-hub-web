// src/components/SkeletonCard.tsx
const SkeletonCard = () => (
  <div className="bg-[#0d1824] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <div className="h-4 w-2/3 bg-white/[0.06] rounded-md animate-pulse" />
      <div className="h-6 w-20 bg-white/[0.06] rounded-full animate-pulse" />
    </div>
    <div className="h-3 w-2/5 bg-white/[0.06] rounded-md animate-pulse" />
    <div className="flex gap-2">
      <div className="h-5 w-16 bg-white/[0.06] rounded-full animate-pulse" />
      <div className="h-5 w-14 bg-white/[0.06] rounded-full animate-pulse" />
      <div className="h-5 w-20 bg-white/[0.06] rounded-full animate-pulse" />
    </div>
    <div className="flex justify-between items-center">
      <div className="h-3 w-24 bg-white/[0.06] rounded-md animate-pulse" />
      <div className="h-8 w-24 bg-white/[0.06] rounded-lg animate-pulse" />
    </div>
  </div>
);

export default SkeletonCard;