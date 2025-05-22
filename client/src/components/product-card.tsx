import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await addToCart(product.id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="product-card group bg-background rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="relative">
          <div
            className="product-image w-full h-48 bg-cover bg-center"
            style={{ 
              backgroundImage: product.imageUrl 
                ? `url(${product.imageUrl})` 
                : "url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600)"
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3">
            {hasDiscount && (
              <Badge className="badge-sale mb-1">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="badge-bestseller">
                BESTSELLER
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement wishlist functionality
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && parseFloat(product.rating) > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(parseFloat(product.rating))}
              </div>
              <span className="text-muted-foreground text-sm ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${parseFloat(product.originalPrice!).toFixed(2)}
                </span>
              )}
            </div>
            
            {showAddToCart && (
              <Button 
                size="icon" 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="shrink-0"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
