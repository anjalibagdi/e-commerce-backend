require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

const products = [
  { name: 'iPhone 15 Pro', description: 'Latest Apple flagship with titanium design and A17 Pro chip.', price: 999, category: 'Electronics', brand: 'Apple', stock: 50, rating: 4.8 },
  { name: 'Samsung Galaxy S24', description: 'Android powerhouse with AI-enhanced camera and Snapdragon 8 Gen 3.', price: 799, category: 'Electronics', brand: 'Samsung', stock: 45, rating: 4.6 },
  { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancelling headphones with 30hr battery.', price: 349, category: 'Electronics', brand: 'Sony', stock: 30, rating: 4.9 },
  { name: 'MacBook Air M3', description: 'Thin, light, and incredibly powerful with M3 chip.', price: 1299, category: 'Electronics', brand: 'Apple', stock: 20, rating: 4.7 },
  { name: 'Nike Air Max 270', description: 'Iconic design with Max Air cushioning for all-day comfort.', price: 150, category: 'Footwear', brand: 'Nike', stock: 100, rating: 4.5 },
  { name: 'Adidas Ultraboost 23', description: 'Responsive running shoe with Boost midsole technology.', price: 190, category: 'Footwear', brand: 'Adidas', stock: 80, rating: 4.6 },
  { name: 'Levi\'s 501 Original Jeans', description: 'Classic straight fit jeans in authentic denim.', price: 89, category: 'Clothing', brand: 'Levi\'s', stock: 200, rating: 4.4 },
  { name: 'The North Face Jacket', description: 'Waterproof and windproof jacket for all weather conditions.', price: 299, category: 'Clothing', brand: 'The North Face', stock: 60, rating: 4.7 },
  { name: 'Dyson V15 Detect', description: 'Most powerful cordless vacuum with laser dust detection.', price: 749, category: 'Home Appliances', brand: 'Dyson', stock: 25, rating: 4.8 },
  { name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker that replaces 7 kitchen appliances.', price: 99, category: 'Home Appliances', brand: 'Instant Pot', stock: 75, rating: 4.7 },
  { name: 'IKEA KALLAX Shelf', description: 'Versatile shelf unit that can be used as bookcase or room divider.', price: 179, category: 'Furniture', brand: 'IKEA', stock: 40, rating: 4.3 },
  { name: 'Herman Miller Aeron Chair', description: 'Ergonomic office chair designed for health and productivity.', price: 1695, category: 'Furniture', brand: 'Herman Miller', stock: 10, rating: 4.9 },
  { name: 'Canon EOS R6 Mark II', description: 'Full-frame mirrorless camera with 40fps burst shooting.', price: 2499, category: 'Electronics', brand: 'Canon', stock: 15, rating: 4.8 },
  { name: 'GoPro Hero 12 Black', description: 'Waterproof action camera with HyperSmooth 6.0 stabilization.', price: 399, category: 'Electronics', brand: 'GoPro', stock: 55, rating: 4.6 },
  { name: 'PlayStation 5', description: 'Next-gen gaming console with 4K gaming and lightning-fast SSD.', price: 499, category: 'Electronics', brand: 'Sony', stock: 5, rating: 4.9 },
  { name: 'Xbox Series X', description: 'Most powerful Xbox ever with 12 teraflops of processing power.', price: 499, category: 'Electronics', brand: 'Microsoft', stock: 8, rating: 4.7 },
  { name: 'Kindle Paperwhite', description: 'Waterproof e-reader with 300 ppi glare-free display.', price: 139, category: 'Electronics', brand: 'Amazon', stock: 90, rating: 4.6 },
  { name: 'Patagonia Fleece Jacket', description: 'Sustainable fleece made from recycled polyester.', price: 169, category: 'Clothing', brand: 'Patagonia', stock: 45, rating: 4.8 },
  { name: 'Yeti Rambler Tumbler', description: '20oz insulated tumbler keeps drinks hot or cold for hours.', price: 35, category: 'Home Appliances', brand: 'Yeti', stock: 150, rating: 4.7 },
  { name: 'Nike Dri-FIT T-Shirt', description: 'Moisture-wicking performance t-shirt for intense workouts.', price: 35, category: 'Clothing', brand: 'Nike', stock: 0, rating: 4.3 },
];

const seedDB = async () => {
  await connectDB();

  // Clear existing data
  await Product.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create regular user
  await User.create({
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  });

  // Create products
  const productsWithAdmin = products.map((p) => ({ ...p, createdBy: admin._id }));
  await Product.insertMany(productsWithAdmin);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@example.com / admin123');
  console.log('👤 User:  user@example.com / user123');
  process.exit();
};

seedDB().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
