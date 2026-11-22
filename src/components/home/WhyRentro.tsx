import { Wallet, BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Affordable Rental Prices",
    description:
      "Get the equipment you need without the high cost of purchasing it.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Equipment Owners",
    description:
      "Discover equipment listed by owners through our approval process.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Rental Periods",
    description: "Choose hourly, daily, weekly, or monthly rental options.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Enjoy a more reliable rental experience with secure payment options.",
  },
];

export default function WhyRentro() {
  return (
    <section className="bg-background px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              The RENTRO advantage
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Why Choose <span className="text-yellow-600">RENTRO?</span>
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-muted-foreground">
              Renting equipment should be simple. RENTRO connects people who
              need equipment with owners who have it, making projects easier to
              manage.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600">
                    <Icon size={25} />
                  </div>
                  <h3 className="font-bold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
