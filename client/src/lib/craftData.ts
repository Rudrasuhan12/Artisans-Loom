export interface Craft {
  name: string;
  description: string;
  image: string;
}

export interface StateData {
  name: string;
  description: string;
  crafts: Craft[];
}

export const craftData: Record<string, StateData> = {
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    description: "A coastal state with a deep artistic tradition, famous for its Kalamkari art and Kondapalli toys.",
    crafts: [
      { name: "Kalamkari Painting", description: "Hand-painted or block-printed textile art, depicting mythological themes.", image: "https://placehold.co/400x300/FF4500/FFFFFF?text=Kalamkari" },
      { name: "Kondapalli Toys", description: "Wooden toys made from softwood, painted with natural colors.", image: "https://placehold.co/400x300/CD853F/FFFFFF?text=Kondapalli" }
    ]
  },
  "Arunachal Pradesh": {
    name: "Arunachal Pradesh",
    description: "Land of the dawn-lit mountains, famous for its intricate weaving and tribal handicrafts.",
    crafts: [
      { name: "Apatani Weaving", description: "Distinctive weaving patterns by the Apatani tribe using bold designs and geometric motifs.", image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Apatani+Weaving" },
      { name: "Wood Carving", description: "Traditional carvings on masks, figurines, and household objects reflecting tribal culture.", image: "https://placehold.co/400x300/654321/FFFFFF?text=Wood+Carving" }
    ]
  },
  "Assam": {
    name: "Assam",
    description: "Known for its tea gardens and rich culture, Assam is celebrated for its silk weaving and bamboo crafts.",
    crafts: [
      { name: "Assam Silk (Muga, Eri, Pat)", description: "Traditional handwoven silk, especially Muga silk known for its golden luster.", image: "https://placehold.co/400x300/FFD700/FFFFFF?text=Assam+Silk" },
      { name: "Bamboo & Cane Crafts", description: "Eco-friendly household and decorative items made from bamboo and cane.", image: "https://placehold.co/400x300/228B22/FFFFFF?text=Bamboo+Cane" }
    ]
  },
  "Bihar": {
    name: "Bihar",
    description: "A state with deep historical roots, Bihar is the birthplace of Madhubani painting, a folk art style practiced by women in the Mithila region.",
    crafts: [
      { name: "Madhubani Painting", description: "Characterized by its eye-catching geometrical patterns, this folk art is done with fingers, twigs, and brushes.", image: "https://placehold.co/400x300/10B981/FFFFFF?text=Madhubani" }
    ]
  },
  "Chhattisgarh": {
    name: "Chhattisgarh",
    description: "Known as the 'Rice Bowl of India', Chhattisgarh is culturally rich with bell-metal craft and tribal art.",
    crafts: [
      { name: "Bell Metal (Dhokra)", description: "Intricate metal figurines and jewelry crafted using the lost-wax process.", image: "https://placehold.co/400x300/DAA520/FFFFFF?text=Bell+Metal" },
      { name: "Bamboo Work", description: "Traditional bamboo crafts including baskets, mats, and household items.", image: "https://placehold.co/400x300/228B22/FFFFFF?text=Bamboo+Work" }
    ]
  },
  "Goa": {
    name: "Goa",
    description: "A coastal paradise known for its Portuguese influence, Goa is rich in bamboo crafts, pottery, and crochet work.",
    crafts: [
      { name: "Bamboo Craft", description: "Handmade baskets, mats, and decorative bamboo products.", image: "https://placehold.co/400x300/2E8B57/FFFFFF?text=Bamboo+Craft" },
      { name: "Crochet & Embroidery", description: "Delicate lace, crochet, and embroidery reflecting Portuguese heritage.", image: "https://placehold.co/400x300/FF69B4/FFFFFF?text=Crochet" }
    ]
  },
  "Gujarat": {
    name: "Gujarat",
    description: "Known for its rich textile heritage, Gujarat is a hub for intricate embroidery, bandhani tie-dye, and the famous Kutch mirror work.",
    crafts: [
      { name: "Kutchi Embroidery", description: "Vibrant and intricate mirror work embroidery, a hallmark of the Kutch region's nomadic communities.", image: "https://placehold.co/400x300/F59E0B/FFFFFF?text=Kutch+Work" },
      { name: "Bandhani (Tie-Dye)", description: "A traditional tie-dye technique resulting in intricate patterns on fabrics like cotton and silk.", image: "https://placehold.co/400x300/8B5CF6/FFFFFF?text=Bandhani" }
    ]
  },
  "Haryana": {
    name: "Haryana",
    description: "Known for its rural culture, Haryana is famous for weaving, pottery, and embroidery.",
    crafts: [
      { name: "Phulkari (shared with Punjab)", description: "Bright floral embroidery often done by village women.", image: "https://placehold.co/400x300/DC143C/FFFFFF?text=Phulkari" },
      { name: "Clay Pottery", description: "Decorative and utilitarian clay pottery with folk motifs.", image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Pottery" }
    ]
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    description: "A land of snowy mountains, Himachal is known for woolen crafts, woodwork, and metalwork.",
    crafts: [
      { name: "Kullu Shawls", description: "Warm handwoven woolen shawls with bright geometric patterns.", image: "https://placehold.co/400x300/708090/FFFFFF?text=Kullu+Shawl" },
      { name: "Chamba Rumal", description: "Handkerchief-like embroidered cloth with miniature-style motifs.", image: "https://placehold.co/400x300/FF69B4/FFFFFF?text=Chamba+Rumal" }
    ]
  },
  "Jharkhand": {
    name: "Jharkhand",
    description: "A state rich in tribal culture, Jharkhand is famous for its stone carving, bamboo crafts, and Sohrai paintings.",
    crafts: [
      { name: "Sohrai & Kohbar Painting", description: "Traditional tribal wall paintings using natural colors, depicting animals, plants, and rituals.", image: "https://placehold.co/400x300/CD853F/FFFFFF?text=Sohrai+Art" },
      { name: "Dokra Craft", description: "Metal craft made using the lost-wax casting technique by tribal artisans.", image: "https://placehold.co/400x300/8B4513/FFFFFF?text=Dokra" }
    ]
  },
  "Karnataka": {
    name: "Karnataka",
    description: "Land of heritage temples and silk, Karnataka is famed for Mysore silk, sandalwood carving, and Bidriware.",
    crafts: [
      { name: "Mysore Silk Sarees", description: "Rich silk sarees with pure zari work, known for their durability and elegance.", image: "https://placehold.co/400x300/BA55D3/FFFFFF?text=Mysore+Silk" },
      { name: "Bidriware", description: "Unique metal craft with silver inlay work on blackened alloy surfaces.", image: "https://placehold.co/400x300/000000/FFFFFF?text=Bidriware" }
    ]
  },
  "Kerala": {
    name: "Kerala",
    description: "God's Own Country, known for its eco-friendly crafts made from coir and coconut shells, and the vibrant masks used in Kathakali dance.",
    crafts: [
      { name: "Coir Products", description: "Eco-friendly mats, hangings, and other articles made from the fiber of coconut husks.", image: "https://placehold.co/400x300/059669/FFFFFF?text=Coir" }
    ]
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    description: "Known as the 'Heart of India', Madhya Pradesh is famous for its tribal art, textiles, and stone crafts.",
    crafts: [
      { name: "Gond Painting", description: "Tribal folk art using dots and lines to depict animals, nature, and deities.", image: "https://placehold.co/400x300/006400/FFFFFF?text=Gond+Painting" },
      { name: "Maheshwari & Chanderi Sarees", description: "Elegant handwoven sarees with fine texture and zari borders.", image: "https://placehold.co/400x300/DA70D6/FFFFFF?text=Chanderi+Saree" }
    ]
  },
  "Maharashtra": {
    name: "Maharashtra",
    description: "A state with diverse culture, known for its Paithani sarees, Warli art, and leather crafts.",
    crafts: [
      { name: "Warli Painting", description: "Tribal paintings using simple white motifs on mud walls, depicting daily life and rituals.", image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Warli+Art" },
      { name: "Paithani Saree", description: "Luxurious silk sarees with intricate zari work, originating from Paithan.", image: "https://placehold.co/400x300/FFD700/FFFFFF?text=Paithani" }
    ]
  },
  "Manipur": {
    name: "Manipur",
    description: "Known as the 'Jewel of India', Manipur is famous for its handlooms, bamboo crafts, and dance costumes.",
    crafts: [
      { name: "Manipuri Handloom (Phanek, Innaphi)", description: "Traditional textiles woven with fine designs and bright colors.", image: "https://placehold.co/400x300/DA70D6/FFFFFF?text=Manipuri+Textile" },
      { name: "Kauna Craft", description: "Unique mats and baskets made from Kauna grass (water reed).", image: "https://placehold.co/400x300/2E8B57/FFFFFF?text=Kauna+Craft" }
    ]
  },
  "Meghalaya": {
    name: "Meghalaya",
    description: "A lush green land of hills and waterfalls, known for bamboo, cane, and weaving crafts.",
    crafts: [
      { name: "Bamboo & Cane Products", description: "Handwoven baskets, mats, furniture, and household goods from bamboo and cane.", image: "https://placehold.co/400x300/556B2F/FFFFFF?text=Bamboo+Crafts" },
      { name: "Eri Silk Weaving", description: "Weaving of warm, eco-friendly Eri silk, also called 'peace silk'.", image: "https://placehold.co/400x300/FF8C00/FFFFFF?text=Eri+Silk" }
    ]
  },
  "Mizoram": {
    name: "Mizoram",
    description: "A hilly state known for its vibrant tribal culture, colorful handlooms, and bamboo-based handicrafts.",
    crafts: [
      { name: "Mizo Puan (Traditional Shawl)", description: "Handwoven shawls with intricate patterns and vibrant colors, worn during festivals and ceremonies.", image: "https://placehold.co/400x300/DC143C/FFFFFF?text=Mizo+Puan" },
      { name: "Bamboo Handicrafts", description: "Household and decorative products made of bamboo, reflecting eco-friendly craftsmanship.", image: "https://placehold.co/400x300/006400/FFFFFF?text=Bamboo+Crafts" }
    ]
  },
  "Nagaland": {
    name: "Nagaland",
    description: "A land of vibrant tribes, Nagaland is rich in weaving, wood carving, and jewelry making.",
    crafts: [
      { name: "Naga Shawls", description: "Colorful handwoven shawls that represent the identity of different Naga tribes.", image: "https://placehold.co/400x300/800080/FFFFFF?text=Naga+Shawl" },
      { name: "Bead Jewellery", description: "Intricate beadwork used in traditional necklaces and ornaments.", image: "https://placehold.co/400x300/9932CC/FFFFFF?text=Bead+Jewelry" }
    ]
  },
  "Odisha": {
    name: "Odisha",
    description: "Home to ancient temples and a vibrant artistic tradition, Odisha is renowned for its intricate Pattachitra paintings and delicate silver filigree work.",
    crafts: [
      { name: "Pattachitra Painting", description: "A traditional, cloth-based scroll painting known for its mythological narratives and rich colors.", image: "https://placehold.co/400x300/A5805E/FFFFFF?text=Pattachitra" },
      { name: "Silver Filigree (Tarakasi)", description: "Delicate and artistic jewellery and decorative items made from fine silver wires.", image: "https://placehold.co/400x300/C8A88A/FFFFFF?text=Tarakasi" }
    ]
  },
  "Punjab": {
    name: "Punjab",
    description: "The land of five rivers, Punjab is rich in phulkari embroidery and woodwork.",
    crafts: [
      { name: "Phulkari Embroidery", description: "Traditional embroidery with floral patterns, usually on dupattas.", image: "https://placehold.co/400x300/FF4500/FFFFFF?text=Phulkari" },
      { name: "Punjabi Jutti", description: "Handcrafted leather footwear, often embroidered with gold and silver threads.", image: "https://placehold.co/400x300/8B4513/FFFFFF?text=Jutti" }
    ]
  },
  "Rajasthan": {
    name: "Rajasthan",
    description: "The land of kings, deserts, and forts. Rajasthan's crafts are as vibrant as its culture, from the iconic Blue Pottery to intricate miniature paintings.",
    crafts: [
      { name: "Blue Pottery", description: "A unique form of pottery made without clay, using quartz stone powder, and decorated in striking blue and white.", image: "https://placehold.co/400x300/3B82F6/FFFFFF?text=Blue+Pottery" },
      { name: "Miniature Painting", description: "Highly detailed, colorful paintings that often depict royal court scenes, battles, and legends.", image: "https://placehold.co/400x300/EF4444/FFFFFF?text=Miniature" }
    ]
  },
  "Sikkim": {
    name: "Sikkim",
    description: "Nestled in the Himalayas, Sikkim is known for its Buddhist-inspired crafts and fine handlooms.",
    crafts: [
      { name: "Thangka Painting", description: "Buddhist scroll paintings depicting deities, mandalas, and spiritual themes.", image: "https://placehold.co/400x300/4682B4/FFFFFF?text=Thangka" },
      { name: "Carpet Weaving", description: "Traditional handwoven woolen carpets with dragon, floral, and geometric motifs.", image: "https://placehold.co/400x300/B22222/FFFFFF?text=Sikkim+Carpet" }
    ]
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    description: "A state of towering temples and rich traditions, renowned for its opulent Kanchipuram silk sarees and intricate Tanjore paintings.",
    crafts: [
      { name: "Tanjore Painting", description: "A classical South Indian painting style, characterized by its rich colors, gold foil, and inlay of glass beads.", image: "https://placehold.co/400x300/DC2626/FFFFFF?text=Tanjore" },
      { name: "Kanchipuram Silk", description: "Luxurious silk sarees woven with heavy silk and gold cloth, known for their vibrant colors and intricate designs.", image: "https://placehold.co/400x300/DB2777/FFFFFF?text=Kanchipuram" }
    ]
  },
  "Telangana": {
    name: "Telangana",
    description: "A young state with a rich cultural past, Telangana is famous for its handlooms and metal crafts.",
    crafts: [
      { name: "Pochampally Ikat", description: "Handwoven ikat sarees and fabrics known for their geometric designs.", image: "https://placehold.co/400x300/FF6347/FFFFFF?text=Pochampally" },
      { name: "Nirmal Paintings", description: "Traditional paintings featuring mythological and floral themes.", image: "https://placehold.co/400x300/FFD700/FFFFFF?text=Nirmal+Art" }
    ]
  },
  "Tripura": {
    name: "Tripura",
    description: "Known for its lush greenery and tribal culture, Tripura excels in bamboo, cane, and handloom weaving.",
    crafts: [
      { name: "Handloom Weaving", description: "Traditional tribal handlooms producing elegant and colorful Risa and Rignai cloth.", image: "https://placehold.co/400x300/800080/FFFFFF?text=Tripura+Weaving" },
      { name: "Bamboo & Cane Crafts", description: "Decorative furniture, mats, and baskets made from bamboo and cane.", image: "https://placehold.co/400x300/2F4F4F/FFFFFF?text=Tripura+Bamboo" }
    ]
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    description: "A land of confluence, its crafts include the delicate Chikankari embroidery of Lucknow and the opulent Zardozi metal embroidery.",
    crafts: [
      { name: "Chikankari Embroidery", description: "A delicate and artfully done hand-embroidery on a variety of textile fabrics like muslin, silk, chiffon, etc.", image: "https://placehold.co/400x300/7C3AED/FFFFFF?text=Chikankari" },
    ]
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    description: "A Himalayan state rich in wood carving, woolen crafts, and paintings.",
    crafts: [
      { name: "Aipan Art", description: "Traditional ritualistic floor art made with red and white natural colors.", image: "https://placehold.co/400x300/B22222/FFFFFF?text=Aipan" },
      { name: "Ringaal Craft", description: "Bamboo weaving craft by hill tribes.", image: "https://placehold.co/400x300/006400/FFFFFF?text=Ringaal" }
    ]
  },
  "West Bengal": {
    name: "West Bengal",
    description: "A hub of culture and art, famous for its Kantha stitch textiles and the rustic beauty of its Terracotta pottery and sculptures.",
    crafts: [
      { name: "Kantha Stitch", description: "A traditional embroidery style of Bengal, characterized by a simple running stitch to create beautiful motifs.", image: "https://placehold.co/400x300/D97706/FFFFFF?text=Kantha" },
      { name: "Terracotta Pottery", description: "Earthy and rustic pottery and sculptures, a signature craft of the Bishnupur region.", image: "https://placehold.co/400x300/9A3412/FFFFFF?text=Terracotta" }
    ]
  },
  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    description: "A paradise on earth, J&K is renowned for its Pashmina, carpets, and papier-mâché.",
    crafts: [
      { name: "Pashmina Shawls", description: "Luxurious handwoven shawls made from fine cashmere wool.", image: "https://placehold.co/400x300/DAA520/FFFFFF?text=Pashmina" },
      { name: "Papier-mâché", description: "Colorful decorative objects made from paper pulp and painted with intricate designs.", image: "https://placehold.co/400x300/1E90FF/FFFFFF?text=Papier+Mache" }
    ]
  },
  "Ladakh": {
    name: "Ladakh",
    description: "A cold desert region known for its wool products, thangka paintings, and metal crafts.",
    crafts: [
      { name: "Thangka Painting", description: "Buddhist scroll paintings depicting deities and mandalas.", image: "https://placehold.co/400x300/483D8B/FFFFFF?text=Thangka" },
      { name: "Wool Products", description: "Handwoven woolen garments and carpets made from yak and sheep wool.", image: "https://placehold.co/400x300/696969/FFFFFF?text=Wool" }
    ]
  },
  "Delhi": {
    name: "Delhi",
    description: "The capital city blends Mughal heritage with modern art, known for zari, meenakari, and ivory carving.",
    crafts: [
      { name: "Zari Embroidery", description: "Gold and silver thread embroidery used in garments and decor.", image: "https://placehold.co/400x300/FFD700/FFFFFF?text=Zari" },
      { name: "Meenakari", description: "Colorful enamel work on metal, often used in jewelry.", image: "https://placehold.co/400x300/FF1493/FFFFFF?text=Meenakari" }
    ]
  },
  "Puducherry": {
    name: "Puducherry",
    description: "Known for French-influenced crafts, including delicate lace work and unique terracotta.",
    crafts: [
      { name: "French Lace Work", description: "Delicate lace and embroidery influenced by French culture.", image: "https://placehold.co/400x300/FFB6C1/FFFFFF?text=Pondy+Lace" }
    ]
  },
  "Lakshadweep": {
    name: "Lakshadweep",
    description: "An archipelago known for its eco-friendly crafts derived from the sea and coconut trees.",
    crafts: [
      { name: "Coir Craft", description: "Eco-friendly mats and baskets made from coconut coir.", image: "https://placehold.co/400x300/20B2AA/FFFFFF?text=Coir" }
    ]
  },
  "Andaman and Nicobar": {
    name: "Andaman and Nicobar",
    description: "Islands known for beautiful shell crafts and wood carvings reflecting coastal life.",
    crafts: [
      { name: "Shell Craft", description: "Decorative items made from sea shells.", image: "https://placehold.co/400x300/87CEEB/FFFFFF?text=Shell+Craft" }
    ]
  },
  "Chandigarh": {
    name: "Chandigarh",
    description: "The capital city known for its modern architecture and traditional phulkari embroidery.",
    crafts: [
      { name: "Phulkari", description: "Continues Punjab’s tradition of phulkari embroidery.", image: "https://placehold.co/400x300/FF6347/FFFFFF?text=Phulkari" }
    ]
  },
  "Dadra and Nagar Haveli": {
    name: "Dadra and Nagar Haveli",
    description: "A region rich in tribal art, especially the iconic Warli paintings.",
    crafts: [
      { name: "Warli Art", description: "Tribal paintings similar to Maharashtra’s Warli style.", image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Warli" }
    ]
  },
  "Daman and Diu": {
    name: "Daman and Diu",
    description: "Coastal enclaves known for their unique blend of cultural heritage and local crafts.",
    crafts: [
      { name: "Warli Art", description: "Tribal paintings reflecting the local coastal and tribal culture.", image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Warli" }
    ]
  },
  // Aliases for compatibility with GeoJSON
  "Orissa": {
    name: "Odisha",
    description: "Home to ancient temples and a vibrant artistic tradition, Odisha is renowned for its intricate Pattachitra paintings and delicate silver filigree work.",
    crafts: [
      { name: "Pattachitra Painting", description: "A traditional, cloth-based scroll painting known for its mythological narratives and rich colors.", image: "https://placehold.co/400x300/A5805E/FFFFFF?text=Pattachitra" },
      { name: "Silver Filigree (Tarakasi)", description: "Delicate and artistic jewellery and decorative items made from fine silver wires.", image: "https://placehold.co/400x300/C8A88A/FFFFFF?text=Tarakasi" }
    ]
  },
  "Jammu & Kashmir": {
    name: "Jammu and Kashmir",
    description: "A paradise on earth, J&K is renowned for its Pashmina, carpets, and papier-mâché.",
    crafts: [
      { name: "Pashmina Shawls", description: "Luxurious handwoven shawls made from fine cashmere wool.", image: "https://placehold.co/400x300/DAA520/FFFFFF?text=Pashmina" },
      { name: "Papier-mâché", description: "Colorful decorative objects made from paper pulp and painted with intricate designs.", image: "https://placehold.co/400x300/1E90FF/FFFFFF?text=Papier+Mache" }
    ]
  }
};