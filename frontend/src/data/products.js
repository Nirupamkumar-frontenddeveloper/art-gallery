const baseProducts = [
  // BOOKMARKS

  {
    id: "bs-bookmark-001",
    bestSeller: true,
    category: "bookmarks",
    title: "Printed Bookmarks",
    price: 1,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1787686935/WhatsApp_Image_2026-08-26_at_1.10.49_AM_ehkjqf.jpg",
    description:
      "Elegant handcrafted bookmark."
    ,
    features: [
  "Premium laminated finish for long-lasting durability",
  "Eco-friendly, high-quality paper",
  "Set of 10 unique and fun bookmark designs",
  "Gift-ready packaging"
]
  },

  // {
  //   id: "bs-bookmark-002",
  //   bestSeller: false,
  //   category: "bookmarks",
  //   title: "Vintage Bookmark",
  //   price: 200,
  //   image:
  //     "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200",
  //   description:
  //     "Vintage themed bookmark design."
  // },

  // {
  //   id: "bs-bookmark-003",
  //   bestSeller: false,
  //   category: "bookmarks",
  //   title: "Minimal Bookmark",
  //   price: 200,
  //   image:
  //     "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200",
  //   description:
  //     "Minimal and aesthetic bookmark."
  // },

  // {
  //   id: "bs-bookmark-004",
  //   bestSeller: false,
  //   category: "bookmarks",
  //   title: "Artistic Bookmark",
  //   price: 200,
  //   image:
  //     "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200",
  //   description:
  //     "Premium artistic bookmark collection."
  // },

  // PLANNERS

  {
    id: "bs-planner-001",
    bestSeller: true,
    category: "planners",
    title: "Daily Planner",
    price: 200,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717651/planner_qkgtr8.jpg",
    description:
      "Stay productive every day."
  },

  {
    id: "bs-planner-002",
    bestSeller: false,
    category: "planners",
    title: "Weekly Planner",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200",
    description:
      "Organize your week efficiently."
  },

  {
    id: "bs-planner-003",
    bestSeller: false,
    category: "planners",
    title: "Goal Planner",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200",
    description:
      "Track goals and achievements."
  },

  {
    id: "bs-planner-004",
    bestSeller: false,
    category: "planners",
    title: "Premium Planner",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200",
    description:
      "Luxury planner for professionals."
  },

  // JOURNALS

  {
    id: "bs-journal-001",
    bestSeller: true,
    category: "journals",
    title: "Creative Journal",
    price: 200,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717650/journal2_zpzrxc.jpg",
    description:
      "Express your creativity daily."
  },

  {
    id: "bs-journal-002",
    bestSeller: false,
    category: "journals",
    title: "Travel Journal",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200",
    description:
      "Capture your travel memories."
  },

  {
    id: "bs-journal-003",
    bestSeller: false,
    category: "journals",
    title: "Mindfulness Journal",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200",
    description:
      "Journal for reflection and growth."
  },

  {
    id: "bs-journal-004",
    bestSeller: false,
    category: "journals",
    title: "Premium Journal",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200",
    description:
      "Premium handcrafted journal."
  },

  // NOTEPAD

  {
    id: "bs-notepad-001",
    bestSeller: true,
    category: "notepad",
    title: "Classic Notepad",
    price: 200,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1781717652/Notepad_2_b82dme.jpg",
    description:
      "Simple and elegant notepad."
  },

  {
    id: "bs-notepad-002",
    bestSeller: false,
    category: "notepad",
    title: "Office Notepad",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=1200",
    description:
      "Perfect for office notes."
  },

  {
    id: "bs-notepad-003",
    bestSeller: false,
    category: "notepad",
    title: "Designer Notepad",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200",
    description:
      "Designer notepad collection."
  },

  {
    id: "bs-notepad-004",
    bestSeller: false,
    category: "notepad",
    title: "Premium Notepad",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200",
    description:
      "Luxury premium notepad."
  }
  ,

  // PAINTINGS

  {
    id: "bs-painting-001",
    bestSeller: false,
    category: "paintings",
    title: "Madhubani Painting",
    price: 1899,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785337299/SKM_C55826071122421_gzs3b1.jpg",
    description:
      "Traditional fish motif for wealth and luck."
    ,
    features: [
      "Handmade Painting",
      "Frame Included",
      "A3(42x29.7cm) Size",
      "Ivory sheet with natural texture",
      "Free shipping"
    ]
  },

  {
    id: "bs-painting-002",
    bestSeller: false,
    category: "paintings",
    title: "Floral Paisley Indian Print",
    price: 1899,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785337298/SKM_C55826071122430_qagt5t.jpg",
   description:
  "Traditional paisley artwork symbolizing elegance, abundance, and heritage.",

features: [
  "Handmade Painting",
  "Frame Included",
  "A3(42x29.7cm) Size",
  "Ivory Sheet with Natural Texture",
  "Free Shipping"
]
  },

  {
    id: "bs-painting-003",
    bestSeller: false,
    category: "paintings",
    title: "Madhubani painting",
    price: 799,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785337298/SKM_C55826071122440_ze3glf.jpg",
    description:
      "Traditional elephant representing wisdom, strength, and prosperity."
    ,
    features: [
      "Handmade Painting",
      "Frame Included",
      "29.7x21cm Size",
      "Ivory sheet with natural texture",
      "Free shipping"
    ]
  },

  {
    id: "bs-painting-004",
    bestSeller: false,
    category: "paintings",
    title: "Kalamkari Painting",
    price: 799,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785337297/SKM_C55826071122431_c8fhcf.jpg",
    description:
  "Traditional Kalamkari floral artwork symbolizing nature, beauty, and harmony.",

features: [
  "Handmade Painting",
  "Frame Included",
  "29.7 × 21 cm Size",
  "Ivory Sheet with Natural Texture",
  "Free Shipping"
]
  }
  ,

  // POSTERS

  {
    id: "bs-poster-001",
    bestSeller: false,
    category: "posters",
    title: "Vintage Travel Poster",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341569/WhatsApp_Image_2026-07-29_at_8.36.57_PM_sjgecn.jpg",
   description:
  "Vintage travel poster inspiring adventure, exploration, and wanderlust.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },

  {
    id: "bs-poster-002",
    bestSeller: false,
    category: "posters",
    title: "Minimal Typographic Poster",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341172/WhatsApp_Image_2026-07-29_at_8.36.54_PM_qlot6g.jpg",
    description:
  "Heartwarming poster celebrating motherhood, love, and family bonds.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },

  {
    id: "bs-poster-003",
    bestSeller: false,
    category: "posters",
    title: "Coffee Break Poster",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341564/WhatsApp_Image_2026-07-29_at_8.36.56_PM_2_io9yxf.jpg",
    description:
  "Cozy coffee poster celebrating warmth, comfort, and relaxation.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },
  {
    id: "bs-poster-004",
    bestSeller: false,
    category: "posters",
    title: "Just Chill Panda🐼",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341564/WhatsApp_Image_2026-07-29_at_8.36.56_PM_1_aimwab.jpg",
    description:
  "Playful panda poster inspiring calm, joy, and positivity.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },
  {
    id: "bs-poster-005",
    bestSeller: false,
    category: "posters",
    title: "You Can Do It ❤️",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341563/SKM_C55826071122450_ohy0s6.jpg",
    description:
  "Minimal motivational poster inspiring confidence, hope, and positivity.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },
  {
    id: "bs-poster-006",
    bestSeller: false,
    category: "posters",
    title: "Chai Time☕",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341563/WhatsApp_Image_2026-07-29_at_8.36.55_PM_eghset.jpg",
    description:
  "Vibrant artwork celebrating chai, comfort, and togetherness.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },
  {
    id: "bs-poster-007",
    bestSeller: false,
    category: "posters",
    title: "Desi Core Art🌸",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341562/WhatsApp_Image_2026-07-29_at_8.36.56_PM_beuh5z.jpg",
    description:
  "Elegant artwork celebrating desi culture, beauty, and tradition.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  },
  {
    id: "bs-poster-008",
    bestSeller: false,
    category: "posters",
    title: "Weekend Calories",
    price: 189,
    image:
      "https://res.cloudinary.com/dcbvuidqn/image/upload/v1785341562/WhatsApp_Image_2026-07-29_at_8.36.55_PM_1_cx6slf.jpg",
    description:
  "Cute hamster poster spreading laughter, fun, and positivity.",

features: [
  "Premium Art Print",
  "A4 Size (21 × 29.7 cm)",
  "Matte Finish Paper",
  "Free Shipping"
]
  }
];

const defaultFeatures = [
  "Premium Quality Materials",
  "Handcrafted Artwork",
  "Custom Personalization",
  "Secure Packaging",
  "Fast Delivery",
];

export const products = baseProducts.map((p) => ({
  ...p,
  features: p.features || defaultFeatures,
}));