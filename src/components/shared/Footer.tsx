import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#171A1C] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              RENTRO<span className="text-gray-400">.</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
              Rent the equipment you need, whenever you need it. Simple,
              flexible and convenient equipment rental.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-semibold">Quick Links</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment"
                  className="transition-colors hover:text-white"
                >
                  Explore Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="transition-colors hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 font-semibold">My Account</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-white"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/bookings"
                  className="transition-colors hover:text-white"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/favorites"
                  className="transition-colors hover:text-white"
                >
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-5 font-semibold">Contact Us</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>Dhaka, Bangladesh</li>
              <li>
                <a
                  href="mailto:hello@rentro.com"
                  className="transition-colors hover:text-white"
                >
                  hello@rentro.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <p className="mb-4 text-sm font-medium text-white">Follow Us</p>

              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.6c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3v3.2h2.6V21h3.6Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M5.2 3.5a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM3.4 9h3.6v11H3.4V9Zm5.8 0h3.5v1.5h.1A3.9 3.9 0 0 1 16.3 8c3.6 0 4.3 2.4 4.3 5.5V20H17v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20H9.2V9Z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RENTRO. All rights reserved.</p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition-colors hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
