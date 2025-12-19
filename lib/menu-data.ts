export const menuData = {
  biryaniSpecial: [
    { item: "mutton biryani full", price: 450, slug: "mutton-biryani-full", image: "/mutton-biryani-rice-dish.jpg" },
    { item: "mutton biryani half", price: 350, slug: "mutton-biryani-half", image: "/half-portion-mutton-biryani.jpg" },
    { item: "chiken biryani full", price: 250, slug: "chicken-biryani-full", image: "/chicken-biryani-full-plate.jpg" },
    { item: "chiken biryani half", price: 150, slug: "chicken-biryani-half", image: "/chicken-biryani-half-portion.jpg" },
    { item: "chiken tikka biryani", price: 280, slug: "chicken-tikka-biryani", image: "/chicken-tikka-biryani.jpg" },
    {
      item: "chiken tangdi biryani full",
      price: 280,
      slug: "chicken-tangdi-biryani-full",
      image: "/chicken-leg-biryani.jpg",
    },
    { item: "roast biryani full", price: 150, slug: "roast-biryani-full", image: "/roast-biryani.jpg" },
  ],

  rotiItems: [
    { item: "Tandoori roti", price: 20, slug: "tandoori-roti", image: "/tandoori-roti-bread.jpg" },
    { item: "Plain naan", price: 30, slug: "plain-naan", image: "/plain-naan-bread.jpg" },
    { item: "butter naan", price: 40, slug: "butter-naan", image: "/butter-naan.png" },
    { item: "Garlic naan", price: 40, slug: "garlic-naan", image: "/garlic-naan.png" },
    { item: "Cheese naan", price: 40, slug: "cheese-naan", image: "/cheese-naan-bread.jpg" },
    { item: "kulch", price: 20, slug: "kulch", image: "/kulcha-bread.jpg" },
    { item: "butter kulch", price: 25, slug: "butter-kulch", image: "/butter-kulcha-bread.jpg" },
  ],

  gravyItems: [
    { item: "Murg musallam", price: 180, slug: "murg-musallam", image: "/murg-musallam-chicken-curry.jpg" },
    { item: "hydrabadi dum chicken", price: 180, slug: "hyderabadi-dum-chicken", image: "/hyderabadi-dum-chicken.jpg" },
    { item: "kadai chicken", price: 180, slug: "kadai-chicken", image: "/kadai-chicken-curry.jpg" },
    { item: "shahi chicken", price: 200, slug: "shahi-chicken", image: "/shahi-korma.webp" },
  ],

  tandooriSpecial: [
    {
      item: "Tandoori Chicken half",
      price: 250,
      slug: "tandoori-chicken-half",
      image: "/tandoori.png",
    },
    {
      item: "Tandoori Chicken full",
      price: 450,
      slug: "tandoori-chicken-full",
      image: "/tandoori.png",
      },
      { item: "Chicken tikka", price: 180, slug: "chicken-tikka", image: "/chicken-tikka.png" },
    { item: "Malai kabab", price: 180, slug: "malai-kabab", image: "/malai-kabab.png" },
    { item: "Haryali kabab", price: 180, slug: "haryali-kabab", image: "/haryali-kabab.png" },
    { item: "Reshmi kabab", price: 180, slug: "reshmi-kabab", image: "/reshmi-kabab.png" },
    { item: "afghani kabab", price: 180, slug: "afghani-kabab", image: "/afghani-kabab.png" },
    { item: "labda kabab", price: 180, slug: "labda-kabab", image: "/labda-kabab.png" },
    { item: "tangdi kabab", price: 180, slug: "tangdi-kabab", image: "/tangadi-kabab.png" },
    { item: "sultani kabab", price: 180, slug: "sultani-kabab", image: "/sultani-kabab.png" },
  ],

  nihariItems: [
    { item: "Paya", price: 150, slug: "paya", image: "/paya.png" },
    { item: "bheja fry", price: 180, slug: "bheja-fry", image: "/bheja-fry.png" },
  ],

  desserts: [
    { item: "Apricot delight", price: 100, slug: "apricot-delight", image: "/apricot.png" },
    { item: "shatoot malai", price: 120, slug: "shatoot-malai", image: "/shatoot.png" },
    { item: "kubani ka mitha", price: 40, slug: "kubani-ka-mitha", image: "/kubani.png" },
    { item: "kaddu ka kheer", price: 80, slug: "kaddu-ka-kheer", image: "/khadu.png" },
    { item: "sitaphal malai", price: 150, slug: "sitaphal-malai", image: "/sitaphal.png" },
  ],
}

export type MenuItem = {
  item: string
  price: number
  slug: string
  image: string
}

export type CartItem = MenuItem & {
  quantity: number
}

export const categories = [
  { id: "biryaniSpecial", label: "Biryani Special", images: "/half-portion-mutton-biryani.jpg" },
  { id: "rotiItems", label: "Roti & Naan", images: "/plain-naan-bread.jpg" },
  { id: "gravyItems", label: "Gravy Items", images: "/kadai-chicken-curry.jpg" },
  { id: "tandooriSpecial", label: "Tandoori Special", images: "/tandoori.png" },
  { id: "nihariItems", label: "Nihari & More", images: "/paya.png" },
  { id: "desserts", label: "Desserts", images: "/apricot.png" },
] as const