import Link from "next/link";
import { MapPin, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Equipment", href: "/equipment" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
  ];

  const accountLinks = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Rentals", href: "/my-rentals" },
    { label: "My Favorites", href: "/dashboard/customer/favorites" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.6c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3v3.2h2.6V21h3.6Z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "#",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M5.2 3.5a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM3.4 9h3.6v11H3.4V9Zm5.8 0h3.5v1.5h.1A3.9 3.9 0 0 1 16.3 8c3.6 0 4.3 2.4 4.3 5.5V20H17v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20H9.2V9Z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-auto border-t border-border/70 bg-background text-foreground">
      <div className="mx-auto max-w-[1350] px-5 lg:px-8">
        {/* Desktop Footer - 5 Columns */}
        <div className="hidden py-12 md:grid md:grid-cols-3 lg:grid-cols-5 lg:gap-10 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-2xl font-extrabold tracking-tight"
            >
              RENTRO<span className="ml-1 text-yellow-500">.</span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Rent the equipment you need, whenever you need it.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-700 dark:text-yellow-400">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Smart Equipment Rental
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-yellow-600 dark:hover:text-yellow-400"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide">My Account</h3>

            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-yellow-600 dark:hover:text-yellow-400"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide">
              Get In Touch
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-yellow-500" />

                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-yellow-500" />

                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:hello@rentro.com"
                    className="mt-1 block break-all text-sm text-muted-foreground transition-colors hover:text-yellow-500"
                  >
                    hello@rentro.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links - Separate 5th Column */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide">Follow Us</h3>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40 hover:bg-yellow-500 hover:text-black hover:shadow-md hover:shadow-yellow-500/10"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Footer - Social Only */}
        <div className="flex flex-col items-center py-6 md:hidden">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-all hover:border-yellow-500/40 hover:bg-yellow-500 hover:text-black"
              >
                {social.svg}
              </a>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            © 2026 RENTRO. All rights reserved.
          </p>
        </div>

        {/* Desktop Bottom */}
        <div className="hidden border-t border-border/70 py-6 md:block">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Legal Links */}
            <div className="flex items-center gap-5 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground transition-colors hover:text-yellow-500"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-muted-foreground transition-colors hover:text-yellow-500"
              >
                Terms & Conditions
              </Link>
            </div>

            {/* Right - Copyright */}
            <p className="text-sm text-muted-foreground">
              © 2026 RENTRO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
