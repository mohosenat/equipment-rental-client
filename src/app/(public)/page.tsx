import HeroSection from "@/components/home/HeroSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategorySection from "@/components/home/CategorySection";
import WhyRentro from "@/components/home/WhyRentro";
import CustomerReviews from "@/components/home/CustomerReviews";
import HowItWorks from "@/components/home/HowItWorks";
import TrustedOwners from "@/components/home/TrustedOwners";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedEquipment />
      <CategorySection />
      <WhyRentro />
      <HowItWorks />
      <TrustedOwners />
      <CustomerReviews />
    </>
  );
}
