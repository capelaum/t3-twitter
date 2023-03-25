import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen justify-center">
      <div className="scrollbar-hide h-full w-full overflow-y-scroll border-x border-slate-700 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
}
