const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      const categories = category.split(',').map((c) => c.trim());
      query.category = { $in: categories };
    }

    if (brand) {
      const brands = brand.split(',').map((b) => b.trim());
      query.brand = { $in: brands };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'top_rated':
        sortObj = { rating: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(pageSize).select('-__v'),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
exports.getFilters = async (req, res, next) => {
  try {
    const [categories, brands, priceStats] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('brand'),
      Product.aggregate([
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.sort(),
        brands: brands.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 10000 },
      },
    });
  } catch (error) {
    next(error);
  }
};
