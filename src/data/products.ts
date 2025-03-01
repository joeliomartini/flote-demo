
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
    name: "Minimal Desk Lamp",
    description: "A sleek, adjustable desk lamp with wireless charging base.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1507646227500-4d01c67d2a25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Lighting",
    featured: true,
    details: {
      material: "Aluminum, Silicone",
      dimensions: "12\" × 5\" × 18\"",
      weight: "2.4 lbs",
      color: ["White", "Black", "Silver"]
    }
  },
  {
    id: "2",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Handcrafted ceramic coffee dripper with matching cup.",
    price: 68.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Kitchen",
    details: {
      material: "Ceramic",
      dimensions: "Dripper: 4\" × 4\" × 6\", Cup: 3\" × 3\" × 4\"",
      weight: "1.2 lbs",
      color: ["White", "Black", "Terra Cotta"]
    }
  },
  {
    id: "3",
    name: "Merino Wool Throw Blanket",
    description: "Ultra-soft merino wool blanket, perfect for cool evenings.",
    price: 98.50,
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Home",
    details: {
      material: "100% Merino Wool",
      dimensions: "50\" × 60\"",
      weight: "2.8 lbs",
      color: ["Cream", "Gray", "Navy"]
    }
  },
  {
    id: "4",
    name: "Minimalist Analog Watch",
    description: "Clean design timepiece with Italian leather strap.",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Accessories",
    featured: true,
    details: {
      material: "Stainless Steel, Italian Leather",
      dimensions: "40mm case",
      weight: "0.2 lbs",
      color: ["Black/Tan", "Silver/Brown", "Gold/Black"]
    }
  },
  {
    id: "5",
    name: "Walnut Cutting Board",
    description: "Solid walnut cutting board with juice groove.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Kitchen",
    details: {
      material: "Solid Walnut",
      dimensions: "18\" × 12\" × 1.5\"",
      weight: "3.6 lbs",
    }
  },
  {
    id: "6",
    name: "Linen Bedding Set",
    description: "Stonewashed linen duvet cover and pillowcases.",
    price: 220.00,
    image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Bedding",
    details: {
      material: "100% European Flax Linen",
      dimensions: "Queen/King Available",
      color: ["White", "Oatmeal", "Sage", "Terracotta"]
    }
  },
  {
    id: "7",
    name: "Ceramic Plant Pot",
    description: "Minimalist ceramic planter with drainage hole.",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Home",
    details: {
      material: "Ceramic",
      dimensions: "6\" × 6\" × 6\"",
      weight: "1.8 lbs",
      color: ["White", "Black", "Terracotta"]
    }
  },
  {
    id: "8",
    name: "Brass Desk Organizer",
    description: "Elegant brass desk organizer for pens and small items.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1544247341-5c3cf5ea7378?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Office",
    details: {
      material: "Solid Brass",
      dimensions: "8\" × 4\" × 2\"",
      weight: "1.2 lbs",
    }
  }
];
