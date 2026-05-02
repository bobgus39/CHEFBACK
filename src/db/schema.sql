-- BISTROCALI Database Schema
-- Run this in the Railway MySQL console after creating the DB

CREATE DATABASE IF NOT EXISTS bistrocali;
USE bistrocali;

CREATE TABLE IF NOT EXISTS terpenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  aroma VARCHAR(200),
  benefits_es TEXT,
  benefits_en TEXT,
  color_hex VARCHAR(7) DEFAULT '#4A7C59',
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_es VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  terpene_profile VARCHAR(100),
  category ENUM('starters', 'mains', 'desserts') NOT NULL,
  price DECIMAL(10,2),
  image_url VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  title_es VARCHAR(200),
  title_en VARCHAR(200),
  category VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INT NOT NULL,
  service_type VARCHAR(50),
  message TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- SEED DATA
-- ========================

INSERT INTO terpenes (name, description_es, description_en, aroma, benefits_es, benefits_en, color_hex) VALUES
(
  'Limoneno',
  'El terpeno cítrico por excelencia, presente en la cáscara de limón y naranja. Aporta frescura, vivacidad y notas ácidas brillantes a los platos.',
  'The quintessential citrus terpene, found in lemon and orange peel. Adds freshness, vibrancy and bright acidic notes to dishes.',
  'Cítrico, fresco, limón',
  'Realza salsas, ceviches y postres cítricos. Potencia la percepción de acidez sin añadir acidez real.',
  'Enhances sauces, ceviches and citrus desserts. Boosts the perception of acidity without adding real acidity.',
  '#F5C842'
),
(
  'Mirceno',
  'El terpeno más abundante en el lúpulo y el cannabis. Terroso, herbal y levemente frutal, da profundidad a guisos y carnes.',
  'The most abundant terpene in hops and cannabis. Earthy, herbal and slightly fruity, it gives depth to stews and meats.',
  'Terroso, herbal, mango',
  'Perfecto para marinadas de carne, guisos lentos y salsas oscuras.',
  'Perfect for meat marinades, slow stews and dark sauces.',
  '#7CB87A'
),
(
  'Linalool',
  'El aroma floral de la lavanda. Sorprendentemente versátil en cocina, aporta elegancia y suavidad.',
  'The floral aroma of lavender. Surprisingly versatile in cooking, adding elegance and softness.',
  'Floral, lavanda, dulce',
  'Ideal para postres, cremas, sorbetes y cócteles. Combina con chocolate y frutas del bosque.',
  'Ideal for desserts, creams, sorbets and cocktails. Pairs with chocolate and berries.',
  '#B39DDB'
),
(
  'Beta-Cariofileno',
  'Picante y especiado, como la pimienta negra. El único terpeno que activa receptores cannabinoides sin efectos psicoactivos.',
  'Spicy and peppery, like black pepper. The only terpene that activates cannabinoid receptors without psychoactive effects.',
  'Picante, pimienta, especiado',
  'Realza platos de carne, curries y salsas especiadas. Aporta calor y profundidad.',
  'Enhances meat dishes, curries and spiced sauces. Adds warmth and depth.',
  '#A1887F'
),
(
  'Pineno',
  'El aroma del pino y el bosque. Fresco, limpio y resinoso, evoca la naturaleza y aporta complejidad aromática.',
  'The aroma of pine and forest. Fresh, clean and resinous, it evokes nature and adds aromatic complexity.',
  'Pino, bosque, resina',
  'Combina con mariscos, ensaladas de hierbas y platos mediterráneos. Refresca paletos ricos en grasa.',
  'Pairs with seafood, herb salads and Mediterranean dishes. Refreshes rich fatty palates.',
  '#43A047'
),
(
  'Terpinoleno',
  'Complejo y multifacético: floral, herbal, ligeramente cítrico y a veces con notas de pino. Raro y sofisticado.',
  'Complex and multifaceted: floral, herbal, slightly citrusy and sometimes with pine notes. Rare and sophisticated.',
  'Floral, herbal, pino, cítrico',
  'Perfecto para infusiones, salsas de autor y maridajes con vino. Aporta sorpresa y sofisticación.',
  'Perfect for infusions, signature sauces and wine pairings. Adds surprise and sophistication.',
  '#80CBC4'
);

INSERT INTO menu_items (name_es, name_en, description_es, description_en, terpene_profile, category, price) VALUES
(
  'Ceviche de Corvina con Limoneno',
  'Sea Bass Ceviche with Limonene',
  'Corvina fresca marinada en leche de tigre con microgotas de limoneno puro de Caliterpenes, ají amarillo y maíz tostado.',
  'Fresh sea bass marinated in tiger''s milk with micro-drops of pure Caliterpenes limonene, yellow chili and toasted corn.',
  'Limoneno', 'starters', 28.00
),
(
  'Burrata con Terpinoleno y Trufa',
  'Burrata with Terpinolene and Truffle',
  'Burrata cremosa sobre cama de rúcula con aceite de oliva aromatizado con terpinoleno, láminas de trufa negra y sal de flor.',
  'Creamy burrata on arugula bed with terpinolene-infused olive oil, black truffle shavings and fleur de sel.',
  'Terpinoleno', 'starters', 24.00
),
(
  'Costillas Ibéricas al Mirceno',
  'Iberian Ribs with Myrcene',
  'Costillas de cerdo ibérico confitadas 12 horas en su jugo con mirceno, tomillo y comino. Servidas con puré de boniato especiado.',
  '12-hour slow-cooked Iberian pork ribs in their juice with myrcene, thyme and cumin. Served with spiced sweet potato purée.',
  'Mirceno', 'mains', 42.00
),
(
  'Lubina con Emulsión de Pineno',
  'Sea Bass with Pine Emulsion',
  'Lubina salvaje a la brasa sobre emulsión de mantequilla con pineno, espárragos verdes y caviar de cítricos.',
  'Wild sea bass on the grill over pine-infused butter emulsion, green asparagus and citrus caviar.',
  'Pineno', 'mains', 46.00
),
(
  'Cochinillo con Beta-Cariofileno',
  'Suckling Pig with Beta-Caryophyllene',
  'Cochinillo segoviano lacado con miel y especias, con una pizca de beta-cariofileno que realza cada bocado con notas de pimienta.',
  'Lacquered Segovia suckling pig with honey and spices, with a hint of beta-caryophyllene that enhances each bite with pepper notes.',
  'Beta-Cariofileno', 'mains', 52.00
),
(
  'Coulant de Chocolate y Linalool',
  'Chocolate Coulant with Linalool',
  'Coulant de chocolate 72% con corazón fundente de linalool y lavanda, helado de vainilla bourbon y polvo de violeta.',
  '72% chocolate coulant with linalool and lavender molten heart, bourbon vanilla ice cream and violet dust.',
  'Linalool', 'desserts', 18.00
),
(
  'Sorbete de Cítricos y Limoneno',
  'Citrus and Limonene Sorbet',
  'Trío de sorbetes de limón Meyer, pomelo rosa y mandarina, potenciados con microgotas de limoneno para una intensidad cítrica extraordinaria.',
  'Trio of Meyer lemon, pink grapefruit and mandarin sorbets, enhanced with micro-drops of limonene for extraordinary citrus intensity.',
  'Limoneno', 'desserts', 16.00
);
