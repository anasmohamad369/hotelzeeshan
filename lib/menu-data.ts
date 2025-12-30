export type BaseItem = {
  item: string;
  image: string;
  stock?: number;
};

export type SingleItem = BaseItem & {
  price: number;
  slug: string;
  variants?: never;
};

export type VariantItem = BaseItem & {
  variants: {
    size: "Half" | "Full";
    price: number;
    slug: string;
    item: string; // Name to display in cart
    stock?: number;
  }[];
  price?: never;
  slug?: never;
};

export type MenuItem = SingleItem | VariantItem;

export type CartItem = {
  item: string;
  price: number;
  slug: string;
  image: string;
  quantity: number;
};

export const menuData: Record<string, MenuItem[]> = {
  biryaniSpecial: [
    {
      item: "Mutton Kachi Dum Biryani",
      image: "/mutton-biryani-rice-dish.jpg",
      variants: [
        {
          size: "Half",
          price: 350,
          slug: "mutton-biryani-half",
          item: "Mutton Kachi Dum Biryani Half",
        },
        {
          size: "Full",
          price: 450,
          slug: "mutton-biryani-full",
          item: "Mutton Kachi Dum Biryani Full",
        },
      ],
    },
    {
      item: "Chicken Kachi Dum Biryani",
      image: "/half-portion-mutton-biryani.jpg",
      variants: [
        {
          size: "Half",
          price: 150,
          slug: "chicken-kachi-biryani-half",
          item: "Chicken Kachi Dum Biryani Half",
        },
        {
          size: "Full",
          price: 250,
          slug: "chicken-kachi-biryani-full",
          item: "Chicken Kachi Dum Biryani Full",
        },
      ],
    },
    {
      item: "Chicken Joint Biryani (1 pc gravy)",
      price: 280,
      slug: "chicken-joint-biryani",
      image: "/chicken-biryani-half-portion.jpg",
    },
    {
      item: "Chicken Tikka Biryani (Bone less)",
      price: 300,
      slug: "chicken-tikka-biryani",
      image: "/chicken-tikka-biryani.jpg",
    },
    {
      item: "Chicken Tangdi Biryani Full (2pc Gravy)",
      price: 300,
      slug: "chicken-tangdi-biryani-full",
      image: "/chicken-leg-biryani.jpg",
    },
    {
      item: "Roast Chicken Biryani Half",
      image: "/roast-biryani.jpg",
      variants: [
        {
          size: "Half",
          price: 150,
          slug: "roast-biryani-half",
          item: "Roast Chicken Biryani Half",
        },
        {
          size: "Full",
          price: 250,
          slug: "roast-biryani-full",
          item: "Roast Chicken Biryani Full",
        },
      ],
    },
    {
      item: "Mini Dum Biryani (1pc)",
      price: 100,
      slug: "mini-dum-biryani",
      image: "/roast-biryani.jpg",
    },
    {
      item: "Chanaga Pappu Mutton",
      price: 450,
      slug: "pappu",
      image: "/muttoncurry.png",
    },
  ],

  rotiItems: [
    {
      item: "Tandoori roti",
      price: 20,
      slug: "tandoori-roti",
      image: "/tandoori-roti-bread.jpg",
    },
    {
      item: "Plain naan",
      price: 30,
      slug: "plain-naan",
      image: "/plain-naan-bread.jpg",
    },
    {
      item: "Butter naan",
      price: 40,
      slug: "butter-naan",
      image: "/butter-naan.png",
    },
    {
      item: "Garlic naan",
      price: 45,
      slug: "garlic-naan",
      image: "/garlic-naan.png",
    },
    { item: "Kulch", price: 25, slug: "kulch", image: "/kulcha-bread.jpg" },
    {
      item: "Butter kulch",
      price: 30,
      slug: "butter-kulch",
      image: "/butter-kulcha-bread.jpg",
    },
  ],

  gravyItems: [
    {
      item: "Murg Musallam",
      image: "/murg-musallam-chicken-curry.jpg",
      variants: [
        {
          size: "Half",
          price: 200,
          slug: "murg-musallam-half",
          item: "Murg Musallam Half (Bone)",
        },
        {
          size: "Full",
          price: 300,
          slug: "murg-musallam-full",
          item: "Murg Musallam Full (Bone)",
        },
      ],
    },
    {
      item: "Hyderabadi Dum Chicken",
      image: "/hyderabadi-dum-chicken2.jpg",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "hyderabadi-dum-chicken-half",
          item: "Hyderabadi Dum Chicken Half(Bone)",
        },
        {
          size: "Full",
          price: 280,
          slug: "hyderabadi-dum-chicken-full",
          item: "Hyderabadi Dum Chicken Full(Bone)",
        },
      ],
    },
    {
      item: "Kadai Chicken",
      image: "/kadai.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "kadai-chicken-half",
          item: "Kadai Chicken Half (Bone)",
        },
        {
          size: "Full",
          price: 280,
          slug: "kadai-chicken-full",
          item: "Kadai Chicken Full (Bone)",
        },
      ],
    },
    {
      item: "Shahi Chicken",
      image: "/shahi-korma.webp",
      variants: [
        {
          size: "Half",
          price: 220,
          slug: "shahi-chicken-half",
          item: "Shahi Chicken Half (Bone)",
        },
        {
          size: "Full",
          price: 320,
          slug: "shahi-chicken-full",
          item: "Shahi Chicken Full (Bone)",
        },
      ],
    },
    {
      item: "Chicken Tikka Masala",
      image: "/chickentikka.png",
      variants: [
        {
          size: "Half",
          price: 220,
          slug: "chicken-tikka-masala-half",
          item: "Chicken Tikka Masala Half (Boneless)",
        },
        {
          size: "Full",
          price: 320,
          slug: "chicken-tikka-masala-full",
          item: "Chicken Tikka Masala Full (Boneless)",
        },
      ],
    },
    {
      item: "Butter Chicken",
      image: "/butterchicken.png",
      variants: [
        {
          size: "Half",
          price: 190,
          slug: "butter-chicken-half",
          item: "Butter Chicken Half (Boneless)",
        },
        {
          size: "Full",
          price: 290,
          slug: "butter-chicken-full",
          item: "Butter Chicken Full (Boneless)",
        },
      ],
    },
    {
      item: "Chicken Masala",
      image: "/chickenmasla.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "chicken-masala-half",
          item: "Chicken Masala Half (Bone)",
        },
        {
          size: "Full",
          price: 280,
          slug: "chicken-masala-full",
          item: "Chicken Masala Full (Bone)",
        },
      ],
    },
    {
      item: "Bheja Fry",
      price: 199,
      slug: "bheja-fry",
      image: "/bheja-fry.png",
    },
    {
      item: "Afghani  Chicken",
      image: "/afghanichicken.png",
      variants: [
        {
          size: "Half",
          price: 190,
          slug: "afghani-chicken-half",
          item: "Afghani Chicken Half ",
        },
        {
          size: "Full",
          price: 290,
          slug: "afghani-chicken-full",
          item: "Afghani Chicken Full ",
        },
      ],
    },
  ],

  tandooriSpecial: [
    {
      item: "Tandoori Chicken",
      image: "/tandoori.png",
      variants: [
        {
          size: "Half",
          price: 250,
          slug: "tandoori-chicken-half",
          item: "Tandoori Chicken Half",
        },
        {
          size: "Full",
          price: 450,
          slug: "tandoori-chicken-full",
          item: "Tandoori Chicken Full",
        },
      ],
    },
    {
      item: "Chicken Tikka",
      image: "/chicken-tikka.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "chicken-tikka-half",
          item: "Chicken tikka Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "chicken-tikka-full",
          item: "Chicken tikka Full",
        },
      ],
    },
    {
      item: "Malai Kabab",
      image: "/malai-kabab.png",
      variants: [
        {
          size: "Half",
          price: 200,
          slug: "malai-kabab-half",
          item: "Malai kabab Half",
        },
        {
          size: "Full",
          price: 330,
          slug: "malai-kabab-full",
          item: "Malai kabab Full",
        },
      ],
    },
    {
      item: "Haryali Kabab",
      image: "/haryali-kabab.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "haryali-kabab-half",
          item: "Haryali kabab Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "haryali-kabab-full",
          item: "Haryali kabab Full",
        },
      ],
    },
    {
      item: "Reshmi Kabab",
      image: "/reshmi-kabab.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "reshmi-kabab-half",
          item: "Reshmi kabab Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "reshmi-kabab-full",
          item: "Reshmi kabab Full",
        },
      ],
    },
    {
      item: "Afghani Kabab",
      image: "/afghani-kabab.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "afghani-kabab-half",
          item: "Afghani kabab Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "afghani-kabab-full",
          item: "Afghani kabab Full",
        },
      ],
    },
    {
      item: "Labda Kabab",
      image: "/labda-kabab.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "labda-kabab-half",
          item: "labda kabab Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "labda-kabab-full",
          item: "labda kabab Full",
        },
      ],
    },
    {
      item: "Tangdi Kabab (1 piece)",
      price: 80,
      slug: "tangdi-kabab",
      image: "/tangadi-kabab.png",
    },
    {
      item: "Sultani Kabab",
      image: "/sultani-kabab.png",
      variants: [
        {
          size: "Half",
          price: 200,
          slug: "sultani-kabab-half",
          item: "sultani kabab Half",
        },
        {
          size: "Full",
          price: 330,
          slug: "sultani-kabab-full",
          item: "sultani kabab Full",
        },
      ],
    },
    {
      item: "Pahadi Kabab",
      image: "/pahadikabab.png",
      variants: [
        {
          size: "Half",
          price: 180,
          slug: "pahadi-kabab-half",
          item: "Pahadi kabab Half",
        },
        {
          size: "Full",
          price: 310,
          slug: "pahadi-kabab-full",
          item: "Pahadi kabab Full",
        },
      ],
    },
    {
      item: "Raan Nawabi",
      price: 130,
      slug: "raan-nawabi",
      image: "/raannawabi.png",
    },
  ],

  nihariItems: [
    { item: "Paya", price: 180, slug: "paya", image: "/paya.png" },
    {
      item: "Nihari  ka Sherwa",
      price: 80,
      slug: "niharisherwa",
      image: "/paya.png",
    },
  ],

  desserts: [
    {
      item: "Apricot delight",
      price: 100,
      slug: "apricot-delight",
      image: "/apricot.png",
      stock: 5,
    },
    {
      item: "shatoot malai",
      price: 120,
      slug: "shatoot-malai",
      image: "/shatoot.png",
// Out of stock example
    },
    {
      item: "kubani ka mitha",
      price: 40,
      slug: "kubani-ka-mitha",
      image: "/kubani.png",
      stock: 10,
    },
    {
      item: "kaddu ka kheer",
      price: 80,
      slug: "kaddu-ka-kheer",
      image: "/khadu.png",
      stock: 8,
    },
    {
      item: "sitaphal malai",
      price: 150,
      slug: "sitaphal-malai",
      image: "/sitaphal.png",

    },
  ],

  extras: [
    {
      item: "Campa Cola (TIN)",
      image: "/campacola.png",

      price: 25,
      slug: "campacola",
    },

    {
      item: "Soft Drink Bottle ",
      price: 10,
      slug: "campacola-bottle",
      image: "/campacolabottle.png",
    },
    {
      item: "Water Bottle",
      price: 10,
      slug: "water-bottle",
      image: "/kinley.png",
    },
    {
      item: "Soda",
      price: 15,
      slug: "soda",
      image: "/soda.png",
    },
    {
      item: "Extra Rice ",
      image: "/extrarice.png",
      variants: [
        {
          size: "Half",
          price: 60,
          slug: "extrarice-half",
          item: "Extra Rice Half",
        },
        {
          size: "Full",
          price: 100,
          slug: "extrarice-full",
          item: "Extra Rice Full",
        },
      ],
    },
    {
      item: "Campa Pet Bottle",
      price: 20,
      slug: "campapetbottle",
      image: "/campapet.png",
    },
  ],
};

export const categories = [
  {
    id: "biryaniSpecial",
    label: "Biryani Special",
    icon: "/half-portion-mutton-biryani.jpg",
  },
  { id: "rotiItems", label: "Roti & Naan", icon: "/plain-naan-bread.jpg" },
  { id: "gravyItems", label: "Gravy Items", icon: "/kadai-chicken-curry.jpg" },
  { id: "tandooriSpecial", label: "Tandoori Special", icon: "/tandoori.png" },
  { id: "nihariItems", label: "Nihari & More", icon: "/paya.png" },
  { id: "desserts", label: "Desserts", icon: "/apricot.png" },
  { id: "extras", label: "Extras", icon: "/apricot.png" },
] as const;
