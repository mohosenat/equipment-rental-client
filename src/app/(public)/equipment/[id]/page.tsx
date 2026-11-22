import { Suspense } from "react";
import EquipmentDetailsClient from "../equipment-details-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EquipmentDetailsContent({ params }: PageProps) {
  const { id } = await params;

  return <EquipmentDetailsClient id={id} />;
}

export default function EquipmentDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-20">
          <div className="mx-auto max-w-6xl animate-pulse space-y-8">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-[4/3] rounded-3xl bg-muted" />
              <div className="space-y-5 py-4">
                <div className="h-5 w-28 rounded bg-muted" />
                <div className="h-10 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-40 rounded-2xl bg-muted" />
              </div>
            </div>
          </div>
        </main>
      }
    >
      <EquipmentDetailsContent params={params} />
    </Suspense>
  );
}
