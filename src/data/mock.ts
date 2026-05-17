export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Main Course' | 'Drinks' | 'Snacks' | 'Dessert';
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  foodCategories: string[];
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  coords: [number, number];
  menu: MenuItem[];
  reviews: Review[];
  isAvailableOnline: boolean;
}

export interface FoodPost {
  id: string;
  user: string;
  userAvatar: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  timeAgo: string;
  location?: string;
}

export const FOOD_POSTS: FoodPost[] = [
  {
    id: "p1",
    user: "Ahmad_Foodie",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    content: "Nemu hidden gem nasi goreng rempah porsi kuli di daerah Merjosari! Rempahnya beneran kerasa dan irisan dagingnya nggak pelit. Mantap pol buat makan malam abis nugas! 🤤🍛",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800",
    likes: 124,
    comments: 18,
    timeAgo: "2 jam yang lalu",
    location: "Nasi Goreng Rempah Jaya"
  },
  {
    id: "p2",
    user: "Siti Kulinery",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    content: "Cuaca Malang lagi dingin enaknya ngebakso. Kuah kaldu Sengkaling ini beneran the best sih, anget dan gurihnya pas. Tahu baksonya juara! 🍜✨",
    image: "https://images.unsplash.com/photo-1634261899147-ece64a8523c0?auto=format&fit=crop&q=80&w=800",
    likes: 89,
    comments: 5,
    timeAgo: "5 jam yang lalu",
    location: "Bakso Sengkaling"
  }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "Ayam Bawang Cak Per",
    type: "Lalapan",
    foodCategories: ["Indonesian", "Ayam", "Sambal", "Lalapan"],
    rating: 4.8,
    reviewCount: 342,
    distance: "200 m",
    priceRange: "Rp 15.000 - Rp 35.000",
    address: "Jl. Raya Tlogomas No.12, Malang (Dekat Kampus 3 UMM)",
    phone: "0812-3456-7890",
    hours: "09:00 - 22:00",
    image: "https://images.unsplash.com/photo-1549488344-c1fb6724b07f?auto=format&fit=crop&q=80&w=800",
    coords: [-7.921500, 112.598000],
    isAvailableOnline: true,
    menu: [
      { id: "m1", name: "Paket Ayam Bawang", description: "Ayam goreng renyah dengan sambal bawang khas pedas nampol lengkap", price: 22000, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m2", name: "Jamur Crispy", description: "Jamur enoki digoreng garing dengan bumbu rahasia", price: 12000, image: "https://images.unsplash.com/photo-1621609176373-10af6f5cecae?auto=format&fit=crop&q=80&w=400", category: "Snacks" },
      { id: "m10", name: "Cah Kangkung Terasi", description: "Tumis kangkung segar dengan terasi udang pilihan", price: 10000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m11", name: "Kol Goreng Crispy", description: "Kol goreng gurih pendamping ayam bawang", price: 8000, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", category: "Snacks" },
      { id: "m3", name: "Es Teh Manis", description: "Es teh manis segar", price: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400", category: "Drinks" }
    ],
    reviews: [
      { id: "rev1", user: "Budi UMM", rating: 5, comment: "Mantap sambalnya bikin nagih!" },
      { id: "rev2", user: "Siti K.", rating: 4, comment: "Selalu ramai kalau jam makan siang kampus." }
    ]
  },
  {
    id: "r2",
    name: "Bakso Sengkaling",
    type: "Bakso",
    foodCategories: ["Indonesian", "Soup", "Meatball", "Bakso"],
    rating: 4.6,
    reviewCount: 521,
    distance: "600 m",
    priceRange: "Rp 12.000 - Rp 25.000",
    address: "Jl. Raya Sengkaling, Malang",
    phone: "0822-9876-5432",
    hours: "10:00 - 21:00",
    image: "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?auto=format&fit=crop&q=80&w=800",
    coords: [-7.918000, 112.601000],
    isAvailableOnline: false,
    menu: [
      { id: "m4", name: "Bakso Campur", description: "Bakso urat sapi asli dengan tahu dan gorengan", price: 18000, image: "https://images.unsplash.com/photo-1634261899147-ece64a8523c0?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m12", name: "Bakso Bakar", description: "Bakso bakar ukuran jumbo dengan bumbu kacang pedas manis", price: 15000, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m13", name: "Tahu Walik Goreng", description: "Tahu walik isi adonan ayam udang renyah", price: 12000, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400", category: "Snacks" },
      { id: "m5", name: "Es Jeruk", description: "Es jeruk segar dari jeruk peras asli", price: 8000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400", category: "Drinks" }
    ],
    reviews: [
      { id: "rev3", user: "Andi", rating: 5, comment: "Kuah baksonya seger banget." }
    ]
  },
  {
    id: "r3",
    name: "Nasi Goreng Rempah Jaya",
    type: "Nasi Goreng",
    foodCategories: ["Indonesian", "Nasi Goreng", "Spicy"],
    rating: 4.9,
    reviewCount: 1024,
    distance: "1.2 km",
    priceRange: "Rp 15.000 - Rp 35.000",
    address: "Jl. Joyo Agung No.1, Merjosari, Malang",
    phone: "0856-1122-3344",
    hours: "15:00 - 23:00",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800",
    coords: [-7.923000, 112.604000],
    isAvailableOnline: true,
    menu: [
      { id: "m6", name: "Nasi Goreng Mawut Rempah", description: "Nasi goreng campur mie dengan bumby rempah kuat dan telur mata sapi", price: 20000, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m7", name: "Nasi Goreng Kambing", description: "Nasi goreng padu irisan daging kambing empuk", price: 35000, image: "https://images.unsplash.com/photo-1550860533-5c5cb293ddcd?auto=format&fit=crop&q=80&w=400", category: "Main Course" }
    ],
    reviews: [
      { id: "rev4", user: "Dewi", rating: 5, comment: "Porsi kuli, rempahnya berasa banget." }
    ]
  },
  {
    id: "r4",
    name: "Mie Setan Suhat",
    type: "Fast Food",
    foodCategories: ["Fast Food", "Noodles", "Spicy", "Mie"],
    rating: 4.7,
    reviewCount: 890,
    distance: "1.5 km",
    priceRange: "Rp 15.000 - Rp 30.000",
    address: "Jl. Soekarno Hatta, Malang",
    phone: "0821-4455-6677",
    hours: "11:00 - 23:00",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800",
    coords: [-7.925000, 112.597000],
    isAvailableOnline: false,
    menu: [
      { id: "m8", name: "Mie Iblis Level 3", description: "Mie pedas manis dengan taburan ayam cincang", price: 15000, image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400", category: "Main Course" },
      { id: "m9", name: "Dimsum Udang", description: "Dimsum gurih", price: 12000, image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400", category: "Snacks" }
    ],
    reviews: []
  }
];
