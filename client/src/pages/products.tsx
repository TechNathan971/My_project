import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const search = params.get('search') || '';
    const category = params.get('category') || 'all';
    
    setSearchQuery(search);
    setSelectedCategory(category);
  }, [location]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: selectedCategory, search: searchQuery }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        const category = categories.find(c => c.slug === selectedCategory);
        if (category) {
          params.append('categoryId', category.id.toString());
        }
      }
      
      const url = `/api/products?${params.toString()}`;
      return fetch(url).then(res => res.json());
    },
    enabled: selectedCategory === 'all' || categories.length > 0,
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filter above
  };

  const selectedCategoryName = selectedCategory === 'all' ? 'All Products' : categories.find(c => c.slug === selectedCategory)?.name || 'All Products';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedCategory === 'all' ? 'All Products' : selectedCategoryName}
          </h1>
          <p className="text-muted-foreground">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Discover our amazing products'}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-background rounded-xl p-4 shadow-sm">
                <Skeleton className="h-48 w-full mb-4 rounded" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No products match your search for "${searchQuery}"`
                  : "No products available in this category"
                }
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
