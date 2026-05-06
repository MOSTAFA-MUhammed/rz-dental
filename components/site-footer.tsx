function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.1H8.5V14h2.1v7h2.9Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm-.2 1.9A2.7 2.7 0 0 0 4.9 7.6v8.8a2.7 2.7 0 0 0 2.7 2.7h8.8a2.7 2.7 0 0 0 2.7-2.7V7.6a2.7 2.7 0 0 0-2.7-2.7H7.6Zm9 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.6A4.4 4.4 0 1 1 7.6 12 4.4 4.4 0 0 1 12 7.6Zm0 1.9A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ead8ba]/70 bg-[#fffaf2]/75 backdrop-blur-xl">
      <div className="section-shell grid gap-6 py-8 text-sm text-[#6a5a46] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="text-center lg:text-left">
          <img src="/Logo-png-rz.png" alt="RZ Dental logo" className="mx-auto h-10 w-auto lg:mx-0" />
          {/* <p>Dental booking flow for clinics, labs, and supply requests.</p> */}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://www.facebook.com/search/top?q=Rz%20dental%20co"
              target="_blank"
              rel="noreferrer"
              aria-label="RZ Dental on Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c19d] bg-white text-[#9a7438] transition hover:bg-[#f7eddc]"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.instagram.com/rz_dental_co/"
              target="_blank"
              rel="noreferrer"
              aria-label="RZ Dental on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c19d] bg-white text-[#9a7438] transition hover:bg-[#f7eddc]"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div className="grid gap-1 text-center lg:text-right">
          <p>
            <span className="font-semibold text-[#24190e]">Owner:</span> Dr-rami zaazoua
          </p>
          <p>
            <span className="font-semibold text-[#24190e]">Phone 1:</span> 01068640141
          </p>
          <p>
            <span className="font-semibold text-[#24190e]">Phone 2:</span> 01287756062
          </p>
        </div>
      </div>
      <div className="text-center mb-2">
          <p className="font-semibold text-[#24190e]">Powered by Mostafa</p>
      </div>
    </footer>
  );
}
