import pool from './connection.js'

export async function initDB() {
  const conn = await pool.getConnection()
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS terpenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description_es TEXT, description_en TEXT,
        aroma VARCHAR(200),
        benefits_es TEXT, benefits_en TEXT,
        color_hex VARCHAR(7) DEFAULT '#4A7C59',
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_es VARCHAR(150) NOT NULL, name_en VARCHAR(150) NOT NULL,
        description_es TEXT, description_en TEXT,
        terpene_profile VARCHAR(100),
        category ENUM('starters','mains','desserts') NOT NULL,
        price DECIMAL(10,2), image_url VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        title_es VARCHAR(200), title_en VARCHAR(200),
        category VARCHAR(50), display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL,
        phone VARCHAR(20), date DATE NOT NULL, time TIME NOT NULL,
        guests INT NOT NULL, service_type VARCHAR(50), message TEXT,
        status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL, read_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Seed terpenes only if table is empty
    const [[{ count }]] = await conn.query('SELECT COUNT(*) as count FROM terpenes')
    if (count === 0) {
      await conn.query(`
        INSERT INTO terpenes (name, description_es, description_en, aroma, benefits_es, benefits_en, color_hex) VALUES
        ('Limoneno','El terpeno cítrico por excelencia, presente en la cáscara de limón y naranja.','The quintessential citrus terpene, found in lemon and orange peel.','Cítrico, fresco, limón','Realza salsas, ceviches y postres cítricos.','Enhances sauces, ceviches and citrus desserts.','#F5C842'),
        ('Mirceno','El terpeno más abundante en el lúpulo. Terroso, herbal y levemente frutal.','The most abundant terpene in hops. Earthy, herbal and slightly fruity.','Terroso, herbal, mango','Perfecto para marinadas de carne y guisos lentos.','Perfect for meat marinades and slow stews.','#7CB87A'),
        ('Linalool','El aroma floral de la lavanda. Versátil en cocina, aporta elegancia.','The floral aroma of lavender. Versatile in cooking, adds elegance.','Floral, lavanda, dulce','Ideal para postres, cremas y cócteles.','Ideal for desserts, creams and cocktails.','#B39DDB'),
        ('Beta-Cariofileno','Picante y especiado como la pimienta negra.','Spicy and peppery, like black pepper.','Picante, pimienta, especiado','Realza carnes, curries y salsas especiadas.','Enhances meat dishes, curries and spiced sauces.','#A1887F'),
        ('Pineno','El aroma del pino y el bosque. Fresco, limpio y resinoso.','The aroma of pine and forest. Fresh, clean and resinous.','Pino, bosque, resina','Combina con mariscos y platos mediterráneos.','Pairs with seafood and Mediterranean dishes.','#43A047'),
        ('Terpinoleno','Complejo: floral, herbal, ligeramente cítrico. Raro y sofisticado.','Complex: floral, herbal, slightly citrusy. Rare and sophisticated.','Floral, herbal, pino, cítrico','Perfecto para infusiones y salsas de autor.','Perfect for infusions and signature sauces.','#80CBC4')
      `)
    }

    // Seed menu only if table is empty
    const [[{ mcount }]] = await conn.query('SELECT COUNT(*) as mcount FROM menu_items')
    if (mcount === 0) {
      await conn.query(`
        INSERT INTO menu_items (name_es, name_en, description_es, description_en, terpene_profile, category, price) VALUES
        ('Ceviche de Corvina con Limoneno','Sea Bass Ceviche with Limonene','Corvina fresca marinada en leche de tigre con microgotas de limoneno puro de Caliterpenes.','Fresh sea bass marinated in tiger\\'s milk with micro-drops of pure Caliterpenes limonene.','Limoneno','starters',28.00),
        ('Burrata con Terpinoleno y Trufa','Burrata with Terpinolene and Truffle','Burrata cremosa con aceite de oliva aromatizado con terpinoleno y trufa negra.','Creamy burrata with terpinolene-infused olive oil and black truffle.','Terpinoleno','starters',24.00),
        ('Costillas Ibéricas al Mirceno','Iberian Ribs with Myrcene','Costillas de cerdo ibérico confitadas 12 horas con mirceno, tomillo y comino.','12-hour slow-cooked Iberian pork ribs with myrcene, thyme and cumin.','Mirceno','mains',42.00),
        ('Lubina con Emulsión de Pineno','Sea Bass with Pine Emulsion','Lubina salvaje a la brasa con emulsión de mantequilla con pineno y espárragos.','Wild sea bass on the grill with pine-infused butter emulsion and asparagus.','Pineno','mains',46.00),
        ('Cochinillo con Beta-Cariofileno','Suckling Pig with Beta-Caryophyllene','Cochinillo lacado con miel y especias con una pizca de beta-cariofileno.','Lacquered suckling pig with honey and spices with a hint of beta-caryophyllene.','Beta-Cariofileno','mains',52.00),
        ('Coulant de Chocolate y Linalool','Chocolate Coulant with Linalool','Coulant de chocolate 72% con corazón fundente de linalool y lavanda.','72% chocolate coulant with linalool and lavender molten heart.','Linalool','desserts',18.00),
        ('Sorbete de Cítricos y Limoneno','Citrus and Limonene Sorbet','Trío de sorbetes cítricos potenciados con limoneno de Caliterpenes.','Trio of citrus sorbets enhanced with Caliterpenes limonene.','Limoneno','desserts',16.00)
      `)
    }

    console.log('✓ Database initialized')
  } finally {
    conn.release()
  }
}
