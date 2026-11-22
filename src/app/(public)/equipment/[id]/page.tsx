import EquipmentDetailsClient from "../equipment-details-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EquipmentDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <EquipmentDetailsClient id={id} />;
}
