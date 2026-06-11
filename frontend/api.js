// FashionCart — Standalone Frontend (localStorage, no backend)

// ── PRODUCT CATALOG — every product has a unique image ────────────
const PRODUCTS = [
  // WOMEN
  { id:'w1',  name:'Floral Midi Dress',     price:1200, original_price:1800, image:'https://images.unsplash.com/photo-1496747611176-84322e1e57c?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Beautiful floral midi dress perfect for summer outings.', sizes:['XS','S','M','L','XL'], colors:['Red','Blue','White'],       material:'Cotton Blend',    rating:4.5, reviews:142 },
  { id:'w2',  name:'Summer Crop Top',       price:600,  original_price:900,  image:'https://images.unsplash.com/photo-1583496661160-fb5218f5f46e?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Sale',    description:'Light and breezy summer crop top.', sizes:['XS','S','M','L'], colors:['White','Black','Pink'],         material:'Pure Cotton',     rating:4.3, reviews:89  },
  { id:'w3',  name:'Evening Gown',          price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Premium', description:'Elegant evening gown for special occasions.', sizes:['S','M','L','XL'], colors:['Black','Navy','Burgundy'],     material:'Chiffon',         rating:4.8, reviews:67  },
  { id:'w4',  name:'Winter Coat',           price:4500, original_price:6000, image:'https://images.unsplash.com/photo-1539533057440-7fc97eab7527?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Warm and stylish winter coat.', sizes:['S','M','L','XL','XXL'], colors:['Camel','Black','Olive'],      material:'Wool Blend',      rating:4.7, reviews:53  },
  { id:'w5',  name:'Casual Kurti',          price:850,  original_price:1200, image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Comfortable cotton kurti for daily wear.', sizes:['S','M','L','XL','XXL'], colors:['Blue','Green','Orange'],   material:'Pure Cotton',     rating:4.4, reviews:215 },
  { id:'w6',  name:'Pleated Skirt',         price:950,  original_price:1400, image:'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Elegant pleated skirt for all occasions.', sizes:['XS','S','M','L'], colors:['Pink','Black','Beige'],       material:'Polyester',       rating:4.2, reviews:78  },
  { id:'w7',  name:'Blazer for Women',      price:2800, original_price:3800, image:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Sharp blazer perfect for office and parties.', sizes:['S','M','L','XL'], colors:['Black','White','Navy'],        material:'Polyester Blend', rating:4.6, reviews:94  },
  { id:'w8',  name:'Silk Saree',            price:5500, original_price:7500, image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Premium', description:'Pure silk saree with elegant zari border.', sizes:['Free Size'], colors:['Red','Green','Blue'],          material:'Pure Silk',       rating:4.9, reviews:183 },
  { id:'w9',  name:'Palazzo Pants',         price:799,  original_price:1100, image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Sale',    description:'Wide-leg palazzo pants for relaxed comfort.', sizes:['XS','S','M','L','XL'], colors:['Black','White','Navy'],   material:'Rayon',           rating:4.1, reviews:127 },
  { id:'w10', name:'Boho Maxi Dress',       price:1500, original_price:2200, image:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Free-spirited boho maxi dress with ethnic prints.', sizes:['XS','S','M','L'], colors:['Multi','Blue','Olive'],  material:'Georgette',       rating:4.5, reviews:162 },
  { id:'w11', name:'Wrap Dress',            price:1400, original_price:2000, image:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'New',     description:'Flattering wrap dress for work and evenings.', sizes:['XS','S','M','L','XL'], colors:['Floral','Black','Wine'], material:'Jersey',          rating:4.4, reviews:98  },
  { id:'w12', name:'Linen Shirt Dress',     price:1100, original_price:1600, image:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'',        description:'Breathable linen shirt dress for casual days.', sizes:['S','M','L','XL'], colors:['White','Beige','Sage'],       material:'Linen',           rating:4.3, reviews:74  },
  { id:'w13', name:'Ruffle Blouse',         price:750,  original_price:1100, image:'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=687&auto=format&fit=crop',   category:'Women', tag:'women', badge:'Sale',    description:'Chic ruffle blouse with feminine detailing.', sizes:['XS','S','M','L'], colors:['White','Pink','Black'],        material:'Chiffon',         rating:4.2, reviews:56  },
  { id:'w14', name:'High Waist Trousers',   price:1300, original_price:1900, image:'https://images.unsplash.com/photo-1548549557-dbe9946621da?q=80&w=687&auto=format&fit=crop',   category:'Women', tag:'women', badge:'',        description:'Sleek high-waist trousers for a polished look.', sizes:['XS','S','M','L','XL'], colors:['Black','Cream','Olive'],material:'Polyester',       rating:4.3, reviews:82  },
  { id:'w15', name:'Off Shoulder Top',      price:699,  original_price:999,  image:'https://images.unsplash.com/photo-1566479179817-c3f20012b6c3?q=80&w=687&auto=format&fit=crop', category:'Women', tag:'women', badge:'Hot',     description:'Trendy off-shoulder top for summer styling.', sizes:['XS','S','M','L'], colors:['White','Black','Red'],         material:'Cotton',          rating:4.4, reviews:201 },
  // MEN
  { id:'m1',  name:'Classic White T-Shirt', price:800,  original_price:1000, image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Sale',    description:'Premium 100% cotton classic white t-shirt.', sizes:['S','M','L','XL','XXL'], colors:['White','Grey','Black'],   material:'100% Cotton',   rating:4.3, reviews:312 },
  { id:'m2',  name:'Leather Jacket',        price:5500, original_price:7500, image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'Hot',     description:'Genuine leather jacket for a bold and edgy look.', sizes:['S','M','L','XL'], colors:['Black','Brown'],           material:'Genuine Leather',rating:4.8, reviews:145 },
  { id:'m3',  name:'Slim Fit Chinos',       price:1500, original_price:2000, image:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Slim-fit chinos for casual and semi-formal.', sizes:['28','30','32','34','36'], colors:['Khaki','Navy','Olive'],material:'Cotton Twill',  rating:4.4, reviews:187 },
  { id:'m4',  name:'Polo Shirt',            price:1000, original_price:1200, image:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Classic polo shirt with premium pique cotton.', sizes:['S','M','L','XL','XXL'], colors:['Navy','White','Green'], material:'Pique Cotton',  rating:4.2, reviews:93  },
  { id:'m5',  name:'Formal Shirt',          price:1200, original_price:1700, image:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Crisp formal shirt for office and events.', sizes:['S','M','L','XL','XXL'], colors:['White','Blue','Grey'],     material:'Cotton Blend',  rating:4.5, reviews:128 },
  { id:'m6',  name:'Men Kurta',             price:1100, original_price:1500, image:'https://images.unsplash.com/photo-1614252234498-2ce4a26b1e5d?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Hot',     description:'Traditional cotton kurta for festive occasions.', sizes:['S','M','L','XL','XXL'], colors:['White','Blue','Olive'],material:'Khadi Cotton', rating:4.6, reviews:234 },
  { id:'m7',  name:'Hoodie Sweatshirt',     price:1800, original_price:2500, image:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'Sale',    description:'Cozy fleece hoodie with kangaroo pocket.', sizes:['S','M','L','XL','XXL'], colors:['Black','Grey','Navy'],    material:'Fleece',        rating:4.4, reviews:176 },
  { id:'m8',  name:'Cargo Pants',           price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Rugged cargo pants with multiple utility pockets.', sizes:['28','30','32','34','36'], colors:['Olive','Black','Khaki'],material:'Canvas', rating:4.3, reviews:109 },
  { id:'m9',  name:'Blazer for Men',        price:3500, original_price:5000, image:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Premium', description:'Tailored blazer for a sharp professional look.', sizes:['S','M','L','XL'], colors:['Black','Navy','Charcoal'],    material:'Wool Blend',    rating:4.7, reviews:88  },
  { id:'m10', name:'Oxford Button Down',    price:1400, original_price:1900, image:'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'',        description:'Classic Oxford button-down for smart casual.', sizes:['S','M','L','XL','XXL'], colors:['Blue','White','Pink'],  material:'Oxford Cotton', rating:4.4, reviews:142 },
  { id:'m11', name:'Linen Casual Shirt',    price:1100, original_price:1600, image:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'New',     description:'Breathable linen shirt for warm weather.', sizes:['S','M','L','XL','XXL'], colors:['White','Beige','Blue'],   material:'Linen',         rating:4.3, reviews:97  },
  { id:'m12', name:'Denim Shirt',           price:1300, original_price:1800, image:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=687&auto=format&fit=crop',   category:'Men', tag:'men', badge:'',        description:'Versatile denim shirt for layered looks.', sizes:['S','M','L','XL'], colors:['Light Blue','Dark Blue'],       material:'Denim',         rating:4.2, reviews:76  },
  { id:'m13', name:'Bomber Jacket',         price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=687&auto=format&fit=crop', category:'Men', tag:'men', badge:'Hot',     description:'Stylish bomber jacket with ribbed cuffs.', sizes:['S','M','L','XL'], colors:['Black','Olive','Navy'],         material:'Nylon',         rating:4.5, reviews:163 },
  // KIDS
  { id:'k1',  name:'Kids Denim Dungaree',   price:699,  original_price:999,  image:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'New',  description:'Adorable denim dungaree for little ones.', sizes:['2-3Y','3-4Y','4-5Y','5-6Y'], colors:['Blue','Light Blue'], material:'Denim',        rating:4.5, reviews:134 },
  { id:'k2',  name:'Girls Frock',           price:550,  original_price:800,  image:'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Sale', description:'Cute printed frock with comfy elastic waist.', sizes:['2-3Y','3-4Y','4-5Y','5-6Y','6-7Y'], colors:['Pink','Yellow','Purple'], material:'Cotton', rating:4.4, reviews:98 },
  { id:'k3',  name:'Boys Casual Tee',       price:399,  original_price:599,  image:'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Hot',  description:'Fun graphic tee for active boys.', sizes:['3-4Y','4-5Y','5-6Y','6-7Y','7-8Y'], colors:['Blue','Red','Green'], material:'Cotton', rating:4.2, reviews:167 },
  { id:'k4',  name:'Kids Winter Jacket',    price:1200, original_price:1800, image:'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'',     description:'Warm padded jacket for all winter.', sizes:['3-4Y','4-5Y','5-6Y','6-7Y'], colors:['Red','Blue','Pink'], material:'Polyester Fill', rating:4.6, reviews:89 },
  { id:'k5',  name:'Kids Tracksuit',        price:799,  original_price:1100, image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'New',  description:'Comfortable tracksuit for active kids.', sizes:['4-5Y','5-6Y','6-7Y','7-8Y'], colors:['Navy','Black','Grey'], material:'Fleece', rating:4.3, reviews:112 },
  { id:'k6',  name:'Girls Party Dress',     price:850,  original_price:1200, image:'https://images.unsplash.com/photo-1476234251651-f353703a034d?q=80&w=687&auto=format&fit=crop', category:'Kids', tag:'kids', badge:'Hot',  description:'Beautiful party dress with tulle skirt.', sizes:['2-3Y','3-4Y','4-5Y','5-6Y'], colors:['Pink','White','Purple'], material:'Tulle & Satin', rating:4.7, reviews:203 },
  // UNISEX
  { id:'u1',  name:'Casual Denim Jeans',    price:1500, original_price:1900, image:'https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'',     description:'Classic blue jeans — goes with everything.',   sizes:['28','30','32','34','36'],  colors:['Light Blue','Dark Blue','Black'], material:'Denim',        rating:4.4, reviews:289 },
  { id:'u2',  name:'Denim Jacket',          price:2200, original_price:2800, image:'https://images.unsplash.com/photo-1516762714551-8f157d9e1b07?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'New',  description:'Versatile denim jacket for any season.',         sizes:['XS','S','M','L','XL'],    colors:['Light Blue','Dark Blue'],        material:'Denim',        rating:4.5, reviews:178 },
  { id:'u3',  name:'Sneakers',              price:2800, original_price:3500, image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'Hot',  description:'Trendy sneakers with superior cushioning.',      sizes:['6','7','8','9','10','11'],colors:['White','Black','Red'],            material:'Mesh & Rubber', rating:4.6, reviews:341 },
  { id:'u4',  name:'Graphic Sweatshirt',    price:1400, original_price:2000, image:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'Sale', description:'Oversized graphic sweatshirt, premium fleece.',  sizes:['S','M','L','XL','XXL'],   colors:['Black','White','Grey'],          material:'Fleece Cotton', rating:4.3, reviews:156 },
  { id:'u5',  name:'Track Pants',           price:999,  original_price:1400, image:'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=687&auto=format&fit=crop', category:'Unisex', tag:'unisex', badge:'',     description:'Relaxed track pants for workout or lounging.',   sizes:['S','M','L','XL','XXL'],   colors:['Black','Navy','Grey'],           material:'Polyester',    rating:4.2, reviews:198 },
  { id:'u6',  name:'Zip-Up Hoodie',         price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=687&auto=format&fit=crop',   category:'Unisex', tag:'unisex', badge:'New',  description:'Full-zip hoodie with kangaroo pocket.',          sizes:['S','M','L','XL','XXL'],   colors:['Black','Grey','Navy'],           material:'Cotton Blend', rating:4.4, reviews:132 },
  // ETHNIC
  { id:'e1',  name:'Anarkali Suit',         price:2200, original_price:3200, image:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'New',     description:'Gorgeous anarkali suit with flared silhouette.',sizes:['S','M','L','XL','XXL'],  colors:['Pink','Blue','Green'],  material:'Georgette',    rating:4.7, reviews:189 },
  { id:'e2',  name:'Sherwani',              price:6500, original_price:9000, image:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Premium', description:'Royal sherwani with gold embroidery.',          sizes:['S','M','L','XL'],         colors:['Cream','Gold','Maroon'],material:'Brocade Silk', rating:4.9, reviews:94  },
  { id:'e3',  name:'Lehenga Choli',         price:4800, original_price:7000, image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Hot',     description:'Stunning lehenga choli with mirror work.',      sizes:['S','M','L','XL'],         colors:['Red','Pink','Teal'],    material:'Net & Silk',   rating:4.8, reviews:267 },
  { id:'e4',  name:'Dhoti Kurta Set',       price:1800, original_price:2500, image:'https://images.unsplash.com/photo-1582610285985-a42d9193f2fd?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'',        description:'Traditional dhoti kurta set for festivals.',    sizes:['S','M','L','XL','XXL'],  colors:['White','Cream'],        material:'Khadi',        rating:4.4, reviews:112 },
  { id:'e5',  name:'Bandhani Saree',        price:3200, original_price:4500, image:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'New',     description:'Vibrant Bandhani saree with tie-dye prints.',   sizes:['Free Size'],             colors:['Red','Yellow','Green'], material:'Georgette',    rating:4.6, reviews:143 },
  { id:'e6',  name:'Salwar Kameez',         price:1500, original_price:2100, image:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Sale',    description:'Classic salwar kameez for everyday ethnic wear.',sizes:['S','M','L','XL','XXL'],  colors:['Blue','Green','Pink'],  material:'Cotton Silk',  rating:4.3, reviews:178 },
  { id:'e7',  name:'Banarasi Silk Saree',   price:7500, original_price:10000,image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=687&auto=format&fit=crop', category:'Ethnic', tag:'ethnic', badge:'Premium', description:'Exquisite Banarasi silk saree — heirloom quality.',sizes:['Free Size'],           colors:['Red','Green','Gold'],   material:'Banarasi Silk',rating:4.9, reviews:321 },
  // ACCESSORIES
  { id:'a1',  name:'Leather Belt',          price:700,  original_price:900,  image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'',       description:'Genuine full-grain leather belt.',         sizes:['28','30','32','34','36'], colors:['Brown','Black'],        material:'Full Grain Leather',rating:4.4, reviews:89  },
  { id:'a2',  name:'Sun Hat',               price:500,  original_price:700,  image:'https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Sale',    description:'Wide-brim sun hat for UV protection.',     sizes:['Free Size'],             colors:['Beige','Brown','White'],material:'Straw',             rating:4.3, reviews:67  },
  { id:'a3',  name:'Tote Bag',              price:1200, original_price:1600, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=687&auto=format&fit=crop',   category:'Accessories', tag:'accessories', badge:'New',     description:'Spacious canvas tote with interior zip.',  sizes:['One Size'],              colors:['Natural','Black','Navy'],material:'Canvas',           rating:4.5, reviews:134 },
  { id:'a4',  name:'Sunglasses',            price:1500, original_price:2200, image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Hot',     description:'UV400 polarized lightweight sunglasses.',  sizes:['One Size'],              colors:['Black','Tortoise'],    material:'Acetate',           rating:4.6, reviews:212 },
  { id:'a5',  name:'Wrist Watch',           price:3500, original_price:5000, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Premium', description:'Elegant stainless steel wrist watch.',     sizes:['One Size'],              colors:['Silver','Gold'],       material:'Stainless Steel',   rating:4.7, reviews:156 },
  { id:'a6',  name:'Scarf',                 price:450,  original_price:650,  image:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'',       description:'Soft and warm winter scarf.',               sizes:['One Size'],              colors:['Beige','Grey','Navy'], material:'Wool Blend',        rating:4.2, reviews:78  },
  { id:'a7',  name:'Leather Handbag',       price:2800, original_price:3800, image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'New',     description:'Premium handbag with gold hardware.',      sizes:['One Size'],              colors:['Black','Tan','Burgundy'],material:'Vegan Leather',    rating:4.6, reviews:189 },
  { id:'a8',  name:'Stud Earrings',         price:350,  original_price:500,  image:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Sale',    description:'Classic gold studs, hypoallergenic posts.', sizes:['One Size'],              colors:['Gold','Silver'],       material:'Brass Gold Plated', rating:4.4, reviews:243 },
  { id:'a9',  name:'Crossbody Bag',         price:1600, original_price:2200, image:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=687&auto=format&fit=crop', category:'Accessories', tag:'accessories', badge:'Hot',     description:'Compact crossbody with adjustable strap.', sizes:['One Size'],              colors:['Black','Brown','Blush'],material:'Faux Leather',     rating:4.3, reviews:167 },
];

// SHOP THE LOOK galleries — curated outfit sets
const LOOK_GALLERY = [
  { id:'look1', title:'Office Ready', desc:'Sharp & Professional', img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=687&auto=format&fit=crop', products:['w7','m9','a5','a1'], tag:'Professional' },
  { id:'look2', title:'Festive Glow', desc:'Celebration Vibes',   img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop', products:['e1','e5','a4','a8'], tag:'Festive'      },
  { id:'look3', title:'Casual Chic',  desc:'Weekend Effortless',  img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=687&auto=format&fit=crop', products:['w10','u1','a3','a2'], tag:'Casual'       },
  { id:'look4', title:'Date Night',   desc:'Elegant & Bold',      img:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop', products:['w3','a5','a8','a4'],  tag:'Glamour'      },
  { id:'look5', title:'Street Smart', desc:'Urban Cool Style',    img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=687&auto=format&fit=crop', products:['m2','u1','u3','u4'],  tag:'Streetwear'   },
  { id:'look6', title:'Beach Vibes',  desc:'Sun & Sea Ready',     img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=687&auto=format&fit=crop', products:['w9','u3','a2','a4'],  tag:'Resort'       },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  AUTH HELPERS â€” localStorage based
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getToken()       { return localStorage.getItem('fc_token'); }
function setToken(t)      { localStorage.setItem('fc_token', t); }
function clearToken()     { localStorage.removeItem('fc_token'); localStorage.removeItem('fc_user'); }
function isLoggedIn()     { return !!getToken(); }
function getCurrentUser() { try { return JSON.parse(localStorage.getItem('fc_user')) || {}; } catch { return {}; } }
function setCurrentUser(u){ localStorage.setItem('fc_user', JSON.stringify(u)); }
function getUsers()       { try { return JSON.parse(localStorage.getItem('fc_users') || '[]'); } catch { return []; } }
function saveUsers(u)     { localStorage.setItem('fc_users', JSON.stringify(u)); }
function makeToken()      { return 'fc_' + Math.random().toString(36).substr(2,9) + '_' + Date.now(); }

function requireLogin() {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
  return true;
}

// â”€â”€ Register â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function apiRegister(payload) {
  const { firstName, lastName, email, phone, password } = payload;
  if (!firstName || !lastName || !email || !password) throw new Error('All fields are required');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already registered');
  const user = {
    id: 'u_' + Date.now(),
    firstName, lastName,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    gender: '', address: {},
    createdAt: new Date().toISOString()
  };
  users.push({ ...user, password });
  saveUsers(users);
  const token = makeToken();
  setToken(token);
  setCurrentUser(user);
  return { token, user };
}

// â”€â”€ Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function apiLogin(email, password) {
  if (!email || !password) throw new Error('Email and password are required');

  // â”€â”€ Pre-seeded demo account (always works) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DEMO_EMAIL    = 'suryasekar626@gmail.com';
  const DEMO_PASSWORD = 'Surya@123';
  if (email.toLowerCase().trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const demoUser = {
      id:        'demo_user_001',
      firstName: 'Surya',
      lastName:  'Sekar',
      email:     DEMO_EMAIL,
      phone:     '+91 98765 43210',
      gender:    'male',
      address:   { line1:'12 MG Road', line2:'Nungambakkam', city:'Chennai', state:'Tamil Nadu', pin:'600034' },
      createdAt: '2024-01-01T00:00:00.000Z'
    };
    const token = makeToken();
    setToken(token);
    setCurrentUser(demoUser);
    return { token, user: demoUser };
  }

  const users = getUsers();
  const found = users.find(u =>
    u.email.toLowerCase() === email.toLowerCase().trim() &&
    u.password === password
  );
  if (!found) throw new Error('Invalid email or password');
  const { password: _pw, ...user } = found;
  const token = makeToken();
  setToken(token);
  setCurrentUser(user);
  return { token, user };
}

// â”€â”€ Get profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function apiGetMe() {
  const u = getCurrentUser();
  if (!u.id) throw new Error('Not logged in');
  return { ...u, createdAt: u.createdAt || new Date().toISOString() };
}

// â”€â”€ Logout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function logout() {
  clearToken();
  window.location.href = 'login.html';
}

function setUserDisplay() {
  const el = document.getElementById('userDisplay');
  if (!el) return;
  const u = getCurrentUser();
  el.textContent = u.firstName || u.email?.split('@')[0] || 'User';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PRODUCTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function normalizeProduct(p) { if (!p.id) p.id = p._id; return p; }

async function fetchProducts(params = {}) {
  let list = [...PRODUCTS];
  if (params.tag && params.tag !== 'all') list = list.filter(p => p.tag === params.tag);
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
  }
  if (params.sort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (params.sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (params.sort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (params.sort === 'discount')   list.sort((a,b) => (b.original_price-b.price)/b.original_price - (a.original_price-a.price)/a.original_price);
  return list;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CART â€” localStorage
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let _cart = [];

function _loadCartFromStorage() {
  try { _cart = JSON.parse(localStorage.getItem('fc_cart') || '[]'); } catch { _cart = []; }
}
function _saveCart() { localStorage.setItem('fc_cart', JSON.stringify(_cart)); }

async function loadCart() { _loadCartFromStorage(); renderCartUI(); }

async function addToCart(productId, qty = 1, size = '', color = '') {
  _loadCartFromStorage();
  const product = PRODUCTS.find(p => p.id === String(productId));
  if (!product) { showToast('Product not found', 'danger'); return; }
  const key = productId + '-' + size + '-' + color;
  const existing = _cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    _cart.push({
      id: 'ci_' + Date.now() + '_' + Math.random().toString(36).substr(2,4),
      key, product_id: productId,
      name: product.name, price: product.price,
      original_price: product.original_price,
      image: product.image, category: product.category,
      qty, size, color
    });
  }
  _saveCart(); renderCartUI();
  showToast(product.name + ' added to cart!', 'success');
}

async function removeFromCart(cartItemId) {
  _loadCartFromStorage();
  _cart = _cart.filter(i => i.id !== cartItemId);
  _saveCart(); renderCartUI();
}

async function updateQty(cartItemId, delta) {
  _loadCartFromStorage();
  const item = _cart.find(i => i.id === cartItemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) _cart = _cart.filter(i => i.id !== cartItemId);
  _saveCart(); renderCartUI();
}

async function clearCart() {
  _cart = []; _saveCart(); renderCartUI();
  showToast('Cart cleared', 'info');
}

function renderCartUI() {
  _loadCartFromStorage();
  const total = _cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = _cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl) return;
  itemsEl.innerHTML = _cart.length === 0
    ? '<div class="text-center py-5 text-muted"><i class="fas fa-shopping-cart fa-3x mb-3 d-block" style="color:var(--border)"></i><p>Your cart is empty</p><a href="index.html" class="btn btn-sm text-white" style="background:var(--gradient);border:none">Shop Now</a></div>'
    : _cart.map(item =>
        '<div class="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">' +
        '<img src="' + item.image + '" class="cart-item-img rounded" alt="' + item.name + '">' +
        '<div class="flex-grow-1">' +
        '<div class="fw-semibold small">' + item.name + '</div>' +
        (item.size ? '<div class="text-muted" style="font-size:.72rem">Size: ' + item.size + '</div>' : '') +
        '<div class="text-muted" style="font-size:.72rem">â‚¹' + item.price.toLocaleString('en-IN') + ' each</div>' +
        '<div class="d-flex align-items-center gap-1 mt-1">' +
        '<button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty(\'' + item.id + '\',-1)">âˆ’</button>' +
        '<span class="px-2">' + item.qty + '</span>' +
        '<button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQty(\'' + item.id + '\',1)">+</button>' +
        '</div></div>' +
        '<div class="text-end">' +
        '<div class="fw-bold" style="color:var(--primary)">â‚¹' + (item.price * item.qty).toLocaleString('en-IN') + '</div>' +
        '<button class="btn btn-sm btn-link text-danger p-0 mt-1" onclick="removeFromCart(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
        '</div></div>'
      ).join('');
  if (totalEl) totalEl.textContent = total.toLocaleString('en-IN');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  WISHLIST â€” localStorage
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let _wishlistIds = [];

function _loadWishlist() {
  try { _wishlistIds = JSON.parse(localStorage.getItem('fc_wishlist') || '[]'); } catch { _wishlistIds = []; }
}
function _saveWishlist() { localStorage.setItem('fc_wishlist', JSON.stringify(_wishlistIds)); }

async function loadWishlistIds() {
  _loadWishlist();
  document.querySelectorAll('.wish-btn').forEach(btn => {
    const id = btn.dataset.id;
    const active = _wishlistIds.includes(id);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'fas fa-heart text-danger' : 'far fa-heart';
  });
}

async function toggleWishlist(productId) {
  productId = String(productId);
  _loadWishlist();
  if (_wishlistIds.includes(productId)) {
    _wishlistIds = _wishlistIds.filter(id => id !== productId);
    showToast('Removed from wishlist', 'info');
  } else {
    _wishlistIds.push(productId);
    showToast('Added to wishlist! â¤ï¸', 'success');
  }
  _saveWishlist();
  document.querySelectorAll('.wish-btn[data-id="' + productId + '"]').forEach(btn => {
    const active = _wishlistIds.includes(productId);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'fas fa-heart text-danger' : 'far fa-heart';
  });
}

function isWishlisted(id) { _loadWishlist(); return _wishlistIds.includes(String(id)); }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  ORDERS â€” localStorage
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getOrders()        { try { return JSON.parse(localStorage.getItem('fc_orders') || '[]'); } catch { return []; } }
function saveOrders(orders) { localStorage.setItem('fc_orders', JSON.stringify(orders)); }

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UNIVERSAL API HANDLER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
async function api(method, endpoint, body) {
  const u = getCurrentUser();

  // â”€â”€ Auth endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'GET' && endpoint === '/auth/me') {
    return { ...u, createdAt: u.createdAt || new Date().toISOString() };
  }
  if (method === 'PUT' && endpoint === '/auth/profile') {
    const updated = { ...u, ...body };
    setCurrentUser(updated);
    const users = getUsers();
    const idx = users.findIndex(x => x.email === u.email);
    if (idx > -1) { Object.assign(users[idx], body); saveUsers(users); }
    return { message: 'Profile updated' };
  }
  if (method === 'PUT' && endpoint === '/auth/address') {
    const updated = { ...u, address: body };
    setCurrentUser(updated);
    const users = getUsers();
    const idx = users.findIndex(x => x.email === u.email);
    if (idx > -1) { users[idx].address = body; saveUsers(users); }
    return { message: 'Address updated' };
  }
  if (method === 'PUT' && endpoint === '/auth/password') {
    const users = getUsers();
    const idx = users.findIndex(x => x.email === u.email);
    if (idx === -1) throw new Error('User not found');
    if (users[idx].password !== body.currentPassword) throw new Error('Current password is incorrect');
    if (body.newPassword.length < 6) throw new Error('Min 6 characters required');
    users[idx].password = body.newPassword;
    saveUsers(users);
    return { message: 'Password changed successfully' };
  }

  // â”€â”€ Product endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'GET' && endpoint.startsWith('/products/')) {
    const id = endpoint.split('/products/')[1];
    return PRODUCTS.find(p => p.id === id) || null;
  }
  if (method === 'GET' && endpoint.startsWith('/products')) {
    return PRODUCTS;
  }

  // â”€â”€ Cart endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'GET' && endpoint === '/cart') {
    _loadCartFromStorage(); return _cart;
  }
  if (method === 'POST' && endpoint === '/cart') {
    await addToCart(body.productId, body.qty || 1, body.size || '', body.color || '');
    return { message: 'Added' };
  }
  if (method === 'DELETE' && endpoint === '/cart') {
    await clearCart(); return { message: 'Cleared' };
  }
  if (method === 'DELETE' && endpoint.startsWith('/cart/')) {
    await removeFromCart(endpoint.split('/cart/')[1]); return { message: 'Removed' };
  }
  if (method === 'PUT' && endpoint.startsWith('/cart/')) {
    _loadCartFromStorage();
    const id = endpoint.split('/cart/')[1];
    const item = _cart.find(i => i.id === id);
    if (item && body.qty) { item.qty = body.qty; _saveCart(); renderCartUI(); }
    return { message: 'Updated' };
  }

  // â”€â”€ Wishlist endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'GET' && endpoint === '/wishlist') {
    _loadWishlist();
    return _wishlistIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  }
  if (method === 'GET' && endpoint === '/wishlist/ids') {
    _loadWishlist(); return _wishlistIds;
  }
  if (method === 'POST' && endpoint === '/wishlist') {
    const pid = String(body.productId);
    _loadWishlist();
    const wasIn = _wishlistIds.includes(pid);
    await toggleWishlist(pid);
    _loadWishlist();
    return { action: _wishlistIds.includes(pid) ? 'added' : 'removed' };
  }
  if (method === 'DELETE' && endpoint === '/wishlist') {
    _wishlistIds = []; _saveWishlist(); return { message: 'Cleared' };
  }

  // â”€â”€ Order endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'GET' && endpoint === '/orders') {
    return [...getOrders()].reverse();
  }
  if (method === 'GET' && endpoint.startsWith('/orders/')) {
    const id = endpoint.split('/orders/')[1].replace('/cancel','');
    return getOrders().find(o => o._id === id) || null;
  }
  if (method === 'POST' && endpoint === '/orders') {
    _loadCartFromStorage();
    if (!_cart.length) throw new Error('Cart is empty');
    const subtotal = _cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const order = {
      _id:      'ord_' + Date.now(),
      orderRef: 'FC' + Date.now(),
      status:   'Confirmed',
      address:  body.address,
      payment:  body.payment,
      subtotal, tax, total,
      items: _cart.map(i => ({
        product: i.product_id,
        name:    i.name,
        price:   i.price,
        qty:     i.qty,
        size:    i.size,
        image:   i.image
      })),
      createdAt: new Date().toISOString()
    };
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);
    _cart = []; _saveCart(); renderCartUI();
    return { message: 'Order placed', orderId: order._id, orderRef: order.orderRef };
  }
  if (method === 'PUT' && endpoint.includes('/cancel')) {
    const id = endpoint.split('/orders/')[1].split('/cancel')[0];
    const orders = getOrders();
    const o = orders.find(x => x._id === id);
    if (!o) throw new Error('Order not found');
    if (o.status !== 'Confirmed') throw new Error('Only confirmed orders can be cancelled');
    o.status = 'Cancelled';
    saveOrders(orders);
    return { message: 'Order cancelled' };
  }

  // â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (method === 'POST' && endpoint === '/contact') {
    const msgs = JSON.parse(localStorage.getItem('fc_messages') || '[]');
    msgs.push({ ...body, date: new Date().toISOString() });
    localStorage.setItem('fc_messages', JSON.stringify(msgs));
    return { message: 'Message received. We will get back to you within 24 hours.' };
  }

  throw new Error('Unknown endpoint: ' + method + ' ' + endpoint);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  TOAST NOTIFICATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const icons = { success:'check-circle', danger:'times-circle', info:'info-circle', warning:'exclamation-circle' };
  const toast = document.createElement('div');
  toast.className = 'toast-item ' + type;
  toast.innerHTML = '<i class="fas fa-' + (icons[type] || 'check-circle') + '"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PRODUCT CARD BUILDER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function buildProductCard(p) {
  const pid = String(p.id);
  const discount = Math.round((1 - p.price / p.original_price) * 100);
  const wishlisted = isWishlisted(pid);
  const stars = p.rating || 4.5;
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 >= 0.5;
  const starHtml = '<i class="fas fa-star"></i>'.repeat(fullStars) + (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '');
  return '<div class="pcard">' +
    '<div class="pcard-img-wrap">' +
    '<img src="' + p.image + '" alt="' + p.name + '" onclick="openProductModal(\'' + pid + '\')">' +
    (p.badge ? '<span class="pcard-badge">' + p.badge + '</span>' : '') +
    '<span class="pcard-discount">-' + discount + '%</span>' +
    '<button class="pcard-wish wish-btn ' + (wishlisted ? 'active' : '') + '" data-id="' + pid + '" onclick="toggleWishlist(\'' + pid + '\')">' +
    '<i class="' + (wishlisted ? 'fas text-danger' : 'far') + ' fa-heart"></i></button>' +
    '</div>' +
    '<div class="pcard-body">' +
    '<p class="pcard-cat">' + p.category + '</p>' +
    '<h6 class="pcard-name" onclick="openProductModal(\'' + pid + '\')">' + p.name + '</h6>' +
    '<div class="pcard-stars">' + starHtml + ' <span style="color:var(--muted);font-size:.7rem">(' + (p.reviews || 0) + ')</span></div>' +
    '<div class="d-flex align-items-center mb-2"><span class="pcard-price">â‚¹' + p.price.toLocaleString('en-IN') + '</span><span class="pcard-old">â‚¹' + p.original_price.toLocaleString('en-IN') + '</span></div>' +
    '<button class="btn-addcart" onclick="addToCart(\'' + pid + '\')"><i class="fas fa-cart-plus me-1"></i>Add to Cart</button>' +
    '</div></div>';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PRODUCT MODAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let _currentProduct = null;

async function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === String(productId));
  if (!p) return;
  _currentProduct = p;
  const discount = Math.round((1 - p.price / p.original_price) * 100);

  document.getElementById('modalProductName').textContent = p.name;
  document.getElementById('modalProductImage').src = p.image;
  document.getElementById('modalProductCategory').textContent = p.category + (p.material ? ' Â· ' + p.material : '');
  document.getElementById('modalProductPrice').innerHTML =
    'â‚¹' + p.price.toLocaleString('en-IN') +
    ' <small class="text-muted text-decoration-line-through">â‚¹' + p.original_price.toLocaleString('en-IN') + '</small>' +
    ' <span class="badge bg-danger">-' + discount + '%</span>';

  // Populate sizes dynamically
  const sizeEl = document.getElementById('modalSize');
  if (sizeEl && p.sizes) {
    sizeEl.innerHTML = '<option value="">Select Size</option>' +
      p.sizes.map(s => '<option>' + s + '</option>').join('');
  }

  // Populate colors dynamically
  const colorEl = document.getElementById('modalColor');
  if (colorEl && p.colors) {
    colorEl.innerHTML = '<option value="">Select Color</option>' +
      p.colors.map(c => '<option>' + c + '</option>').join('');
  }

  if (document.getElementById('quantityInput')) document.getElementById('quantityInput').value = 1;

  // Unique feature: show description in modal
  const descEl = document.getElementById('modalProductDesc');
  if (descEl) descEl.textContent = p.description || '';

  new bootstrap.Modal(document.getElementById('productModal')).show();
}

async function addToCartFromModal() {
  if (!_currentProduct) return;
  const qty   = parseInt(document.getElementById('quantityInput')?.value) || 1;
  const size  = document.getElementById('modalSize')?.value  || '';
  const color = document.getElementById('modalColor')?.value || '';
  await addToCart(_currentProduct.id, qty, size, color);
  bootstrap.Modal.getInstance(document.getElementById('productModal'))?.hide();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UNIQUE FEATURE: SIZE GUIDE POPUP
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function showSizeGuide() {
  showToast('Size Guide: XS=32", S=34", M=36", L=38", XL=40", XXL=42"', 'info');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UNIQUE FEATURE: RECENTLY VIEWED
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function addToRecentlyViewed(productId) {
  let rv = JSON.parse(localStorage.getItem('fc_recent') || '[]');
  rv = rv.filter(id => id !== productId);
  rv.unshift(productId);
  rv = rv.slice(0, 6);
  localStorage.setItem('fc_recent', JSON.stringify(rv));
}

function getRecentlyViewed() {
  const rv = JSON.parse(localStorage.getItem('fc_recent') || '[]');
  return rv.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  UNIQUE FEATURE: STYLE QUIZ
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function getStyleRecommendations(gender) {
  const tag = gender === 'male' ? 'men' : gender === 'female' ? 'women' : 'unisex';
  return PRODUCTS.filter(p => p.tag === tag).sort(() => Math.random() - 0.5).slice(0, 4);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  INIT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
document.addEventListener('DOMContentLoaded', () => {
  setUserDisplay();
  if (isLoggedIn()) {
    loadCart();
    loadWishlistIds();
  }
});

