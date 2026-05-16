import { Suspense } from "react";
import PublicNavigation from "@/src/components/layout/PublicNavigation";
import PublicFooter from "@/src/components/layout/PublicFooter";

// Navbar skeleton - just a thin bar so there's no layout shift
function NavbarSkeleton() {
  return (
    <div className="fixed top-0 w-full z-50 h-[72px] bg-white/95 backdrop-blur-xl border-b border-zinc-200/50" />
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <PublicNavigation />
      </Suspense>
      <div className="pb-24 lg:pb-0">
        {children}
      </div>
      <Suspense fallback={null}>
        <PublicFooter />
      </Suspense>
    </>
  );
}
