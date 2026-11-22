"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Arif Rahman",
    role: "Construction Professional",
    comment:
      "Finding the right equipment for my project became much easier. The rental process was straightforward and convenient.",
    rating: 5,
  },
  {
    name: "Nadia Islam",
    role: "Photographer",
    comment:
      "I needed photography equipment for a short project. Having flexible rental options made a real difference.",
    rating: 5,
  },
  {
    name: "Samiul Hasan",
    role: "Small Business Owner",
    comment:
      "RENTRO makes it easier to find equipment without having to invest in expensive purchases.",
    rating: 4,
  },
  {
    name: "Tanjila Ahmed",
    role: "Event Organizer",
    comment:
      "The idea of finding different types of equipment in one place is incredibly useful for event planning.",
    rating: 5,
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-muted/40 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
            What people say
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Experiences That Matter
          </h2>
          <p className="mt-4 text-muted-foreground">
            A sample of the kind of experience RENTRO aims to deliver.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="text-yellow-500" size={28} />

              <div className="mt-5 flex gap-1">
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-4 min-h-28 text-sm leading-7 text-muted-foreground">
                “{review.comment}”
              </p>

              <div className="mt-6 border-t border-border pt-4">
                <h3 className="font-bold text-foreground">{review.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {review.role}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
