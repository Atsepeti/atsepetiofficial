export function HorseshoeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.2c-4.9 0-8.4 3.7-8.4 9.2V21c0 .7.5.8 1.4.8h2.6c.9 0 1.4-.2 1.4-1.1v-8.6c0-2.3.9-3.6 3-3.6s3 1.3 3 3.6v8.6c0 .9.5 1.1 1.4 1.1h2.6c.9 0 1.4-.1 1.4-.8v-9.6c0-5.5-3.5-9.2-8.4-9.2Z"
        fill="currentColor"
      />
      <circle cx="6" cy="13.5" r="1.1" fill="#FAF3E7" />
      <circle cx="18" cy="13.5" r="1.1" fill="#FAF3E7" />
      <circle cx="6.3" cy="9" r="1" fill="#FAF3E7" />
      <circle cx="17.7" cy="9" r="1" fill="#FAF3E7" />
      <circle cx="12" cy="5.4" r="1" fill="#FAF3E7" />
    </svg>
  );
}

export function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8Z"
        fill="currentColor"
      />
      <path d="m10 15.2 5.2-3.2L10 8.8v6.4Z" fill="#FAF3E7" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="group-hover:animate-gallop grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-hay text-ink shadow-[3px_3px_0_#241708] transition-transform">
        <HorseshoeIcon className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="font-display text-2xl leading-none tracking-wide">
          AT SEPETİ
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-mocha">
            30 dk&apos;da kapında
          </span>
        </span>
      )}
    </span>
  );
}
