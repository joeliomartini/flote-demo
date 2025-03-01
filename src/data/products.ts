
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  details?: {
    material?: string;
    dimensions?: string;
    weight?: string;
    color?: string[];
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium CBD Oil",
    description: "High-quality CBD oil for relaxation and wellness.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1611249021021-9cbb4aef104a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Tinctures",
    featured: true,
    details: {
      material: "Full Spectrum Extract",
      dimensions: "30ml Bottle",
      weight: "1.2 oz",
      color: ["Clear", "Amber"]
    }
  },
  {
    id: "2",
    name: "Infused Pre-Rolls",
    description: "Expertly crafted pre-rolls for a premium experience.",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1621466550398-ac8062907657?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Flower",
    details: {
      material: "Indoor Grown",
      dimensions: "Standard Size",
      weight: "1g each",
      color: ["Green", "Purple"]
    }
  },
  {
    id: "3",
    name: "Cannabis-Infused Gummies",
    description: "Delicious fruit-flavored edibles for a consistent dose.",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Edibles",
    details: {
      material: "Natural Ingredients",
      dimensions: "10 pieces per pack",
      weight: "100mg total",
      color: ["Assorted"]
    }
  },
  {
    id: "4",
    name: "Vape Cartridge",
    description: "Premium distillate vape cartridge with natural terpenes.",
    price: 49.00,
    image: "https://images.unsplash.com/photo-1579282240050-352db0a14c21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Concentrates",
    featured: true,
    details: {
      material: "Glass and Metal",
      dimensions: "510 Thread",
      weight: "1g",
      color: ["Gold", "Clear"]
    }
  },
  {
    id: "5",
    name: "Hemp-Infused Salve",
    description: "Soothing topical cream for localized relief.",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1558453627-ada1b4f7c1b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Topicals",
    details: {
      material: "All-Natural",
      dimensions: "2oz Container",
      weight: "2 oz",
    }
  },
  {
    id: "6",
    name: "CBD Sleep Tincture",
    description: "Specialized formula with melatonin for improved sleep.",
    price: 58.00,
    image: "https://images.unsplash.com/photo-1584607737663-84f13c3124c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Tinctures",
    details: {
      material: "MCT Oil Base",
      dimensions: "30ml Dropper Bottle",
      color: ["Dark Amber"]
    }
  },
  {
    id: "7",
    name: "Cannabis Terpene Diffuser",
    description: "Aromatherapy device using natural cannabis terpenes.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1636599882576-58ee0b2e0116?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    details: {
      material: "Ceramic",
      dimensions: "6\" × 6\" × 6\"",
      weight: "1.8 lbs",
      color: ["White", "Black", "Green"]
    }
  },
  {
    id: "8",
    name: "Hemp Rolling Papers",
    description: "Premium organic hemp rolling papers with natural gum.",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1619230506840-6bcfbc457502?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    details: {
      material: "Organic Hemp",
      dimensions: "King Size",
      weight: "14g",
    }
  }
];
