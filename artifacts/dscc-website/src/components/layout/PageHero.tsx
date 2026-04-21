import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  eyebrow?: string;
  children?: ReactNode;
  align?: "start" | "center";
};

export function PageHero({ title, subtitle, image, eyebrow, children, align = "start" }: Props) {
  const baseUrl = import.meta.env.BASE_URL;
  const normalized = image.startsWith("/") ? image : `/${image}`;
  const src = `${baseUrl.replace(/\/$/, "")}${normalized}`;
  return (
    <section className="relative isolate overflow-hidden bg-neutral-900 text-white">
      <div className="absolute inset-0 -z-10">
        <img src={src} alt="" className="size-full object-cover" loading="eager" decoding="sync" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className={`container py-24 md:py-32 min-h-[360px] md:min-h-[420px] flex flex-col justify-center ${align === "center" ? "items-center text-center" : ""}`}>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] mb-5 self-start">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/90 leading-relaxed drop-shadow">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
