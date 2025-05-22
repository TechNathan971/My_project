import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import CategoryGrid from "@/components/category-grid";
import FeaturedProducts from "@/components/featured-products";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <CategoryGrid />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
