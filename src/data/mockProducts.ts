export interface Product {
  id: string;
  name: string;
  category: "Prescription" | "OTC" | "Wellness" | "Medical Equipment";
  price: number;
  description: string;
  inStock: boolean;
  stockCount: number;
  requiresPrescription: boolean;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Amoxicillin 500mg",
    category: "Prescription",
    price: 15.99,
    description: "Broad-spectrum penicillin antibiotic used to treat various bacterial infections.",
    inStock: true,
    stockCount: 50,
    requiresPrescription: true,
    imageUrl: "https://picsum.photos/seed/med1/400/400"
  },
  {
    id: "p2",
    name: "Lisinopril 10mg",
    category: "Prescription",
    price: 12.50,
    description: "ACE inhibitor used to treat high blood pressure and heart failure.",
    inStock: true,
    stockCount: 30,
    requiresPrescription: true,
    imageUrl: "https://picsum.photos/seed/med2/400/400"
  },
  {
    id: "p3",
    name: "Ibuprofen 400mg",
    category: "OTC",
    price: 8.99,
    description: "Nonsteroidal anti-inflammatory drug (NSAID) for pain relief and fever reduction.",
    inStock: true,
    stockCount: 120,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med3/400/400"
  },
  {
    id: "p4",
    name: "Loratadine 10mg",
    category: "OTC",
    price: 14.99,
    description: "Non-drowsy antihistamine for allergy relief.",
    inStock: true,
    stockCount: 85,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med4/400/400"
  },
  {
    id: "p5",
    name: "Premium Multivitamin Complex",
    category: "Wellness",
    price: 24.99,
    description: "Daily multivitamin providing essential vitamins and minerals for overall health.",
    inStock: true,
    stockCount: 60,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med5/400/400"
  },
  {
    id: "p6",
    name: "Omega-3 Fish Oil 1000mg",
    category: "Wellness",
    price: 19.50,
    description: "High-quality fish oil supplement to support heart, brain, and joint health.",
    inStock: true,
    stockCount: 45,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med6/400/400"
  },
  {
    id: "p7",
    name: "Digital Blood Pressure Monitor",
    category: "Medical Equipment",
    price: 49.99,
    description: "Accurate and easy-to-use automatic upper arm blood pressure monitor.",
    inStock: true,
    stockCount: 15,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med7/400/400"
  },
  {
    id: "p8",
    name: "Pulse Oximeter",
    category: "Medical Equipment",
    price: 29.99,
    description: "Fingertip pulse oximeter for measuring blood oxygen saturation and pulse rate.",
    inStock: false,
    stockCount: 0,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med8/400/400"
  },
  {
    id: "p9",
    name: "Atorvastatin 20mg",
    category: "Prescription",
    price: 18.00,
    description: "Statin medication used to lower cholesterol and reduce the risk of heart disease.",
    inStock: true,
    stockCount: 40,
    requiresPrescription: true,
    imageUrl: "https://picsum.photos/seed/med9/400/400"
  },
  {
    id: "p10",
    name: "Melatonin 5mg",
    category: "Wellness",
    price: 11.99,
    description: "Natural sleep aid to support a healthy sleep cycle.",
    inStock: true,
    stockCount: 100,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med10/400/400"
  },
  {
    id: "p11",
    name: "First Aid Kit Pro",
    category: "Medical Equipment",
    price: 35.00,
    description: "Comprehensive 200-piece first aid kit for home, car, or travel.",
    inStock: true,
    stockCount: 25,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med11/400/400"
  },
  {
    id: "p12",
    name: "Cetirizine 10mg",
    category: "OTC",
    price: 13.99,
    description: "Fast-acting allergy relief for indoor and outdoor allergies.",
    inStock: true,
    stockCount: 75,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med12/400/400"
  },
  {
    id: "p13",
    name: "Metformin 500mg",
    category: "Prescription",
    price: 10.50,
    description: "First-line medication for the treatment of type 2 diabetes.",
    inStock: true,
    stockCount: 55,
    requiresPrescription: true,
    imageUrl: "https://picsum.photos/seed/med13/400/400"
  },
  {
    id: "p14",
    name: "Vitamin C 1000mg",
    category: "Wellness",
    price: 14.50,
    description: "Immune system support with high-potency Vitamin C.",
    inStock: true,
    stockCount: 90,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med14/400/400"
  },
  {
    id: "p15",
    name: "Infrared Forehead Thermometer",
    category: "Medical Equipment",
    price: 39.99,
    description: "Non-contact infrared thermometer for quick and accurate temperature readings.",
    inStock: true,
    stockCount: 20,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med15/400/400"
  },
  {
    id: "p16",
    name: "Acetaminophen 500mg",
    category: "OTC",
    price: 7.99,
    description: "Pain reliever and fever reducer.",
    inStock: true,
    stockCount: 150,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med16/400/400"
  },
  {
    id: "p17",
    name: "Albuterol Inhaler",
    category: "Prescription",
    price: 25.00,
    description: "Bronchodilator used to treat or prevent bronchospasm in people with asthma.",
    inStock: false,
    stockCount: 0,
    requiresPrescription: true,
    imageUrl: "https://picsum.photos/seed/med17/400/400"
  },
  {
    id: "p18",
    name: "Probiotics 50 Billion CFU",
    category: "Wellness",
    price: 28.99,
    description: "Advanced daily probiotic for digestive and immune health.",
    inStock: true,
    stockCount: 65,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med18/400/400"
  },
  {
    id: "p19",
    name: "Compression Socks",
    category: "Medical Equipment",
    price: 18.50,
    description: "Medical-grade compression socks to improve circulation.",
    inStock: true,
    stockCount: 40,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med19/400/400"
  },
  {
    id: "p20",
    name: "Omeprazole 20mg",
    category: "OTC",
    price: 16.99,
    description: "Acid reducer for the treatment of frequent heartburn.",
    inStock: true,
    stockCount: 80,
    requiresPrescription: false,
    imageUrl: "https://picsum.photos/seed/med20/400/400"
  }
];
