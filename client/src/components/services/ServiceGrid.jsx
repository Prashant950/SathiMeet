import { useMemo } from "react";
import ServiceCard from "./ServiceCard";
import { useGetPublicServicesCatalogQuery } from "../../features/api/apiSlice";

const ServiceGrid = ({ onBook }) => {
  const { data: dbCatalogData, isLoading } = useGetPublicServicesCatalogQuery();

  const services = useMemo(() => {
    const raw = dbCatalogData?.data || [];
    return raw.map((s, idx) => ({
      id: s._id || s.slug || idx + 1,
      _id: s._id,
      title: s.title,
      category: s.category || "social",
      tag: s.tag || "Popular",
      rating: s.rating || 4.9,
      description: s.description || "Verified on-demand companionship & lifestyle support.",
      price: `₹${s.rate || 1000}/session`,
      rate: s.rate || 1000,
      button: "Book Sathi",
      color: s.color || "from-violet-600 to-indigo-500",
    }));
  }, [dbCatalogData]);

  return (
    <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:mt-14 lg:grid-cols-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBook={onBook}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;