
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBrands } from "@/services/brandService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartTab from "@/components/CartTab";
import CartDrawer from "@/components/CartDrawer";

const Brands = () => {
  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Featured Brands</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore our curated collection of premium cannabis brands
          </p>
          <Separator className="mt-6" />
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted h-64"></div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Failed to load brands. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands?.map((brand) => (
              <Card key={brand.id} className="overflow-hidden flex flex-col">
                <div className="aspect-square relative bg-secondary/30 flex items-center justify-center p-6">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="p-6 flex-1">
                  <h2 className="text-xl font-medium">{brand.name}</h2>
                  <p className="mt-2 text-muted-foreground line-clamp-3">{brand.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/brand/${brand.id}`}>View Products</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <CartDrawer />
      <CartTab />
    </div>
  );
};

export default Brands;
