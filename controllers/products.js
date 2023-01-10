const Product = require("../models/Product");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Review = require("../models/Review");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

const getProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    _id: productId,
  });

  if (!product) {
    throw new NotFoundError(`no product  with id ${productId}`);
  }

  const reviews = await Review.find({ ProductId: product._id });
  product.reviews = reviews;

  res.status(StatusCodes.OK).json({ product });
};

const CreateProduct = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, product });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const deleteProduct = async (req, res) => {
  const isAdmin = req.user.admin;
  const {
    params: { id: productId },
  } = req;

  if (isAdmin) {
    const product = await Product.findByIdAndRemove({
      _id: productId,
    });

    if (!product) {
      throw new NotFoundError(`no product with id ${productId}`);
    }

    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};
const updateProduct = async (req, res) => {
  const {
    body: { name, price, featured, rating, createdAt, company, thumbnail },
    params: { id: productId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      throw new NotFoundError(`no product with id ${productId}`);
    }

    res.status(StatusCodes.OK).json({
      _id: product._id,
      name: product.name,
      price: product.price,
      featured: product.featured,
      rating: product.rating,
      createdAt: product.createdAt,
      company: product.company,
      thumbnail: product.thumbnail,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const addReview = async (req, res) => {
  const userId = req.user.userId;
  const rev = req.body.review;
  const id = req.params.id;

  const review = await Review.create({
    userId: userId,
    ProductId: id,
    review: rev,
  });

  let product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError("NO PRODUCT WITH THIS ID");
  }
  const reviews = await Review.find({ ProductId: id });
  product.reviews = reviews;
  res.status(StatusCodes.CREATED).json({ product });
};
const deleteReview = async (req, res) => {
  const {
    user: { userId },
    params: { id: reviewId },
  } = req;

  const isAdmin = req.user.admin;

  const id = await Review.findOne({ _id: reviewId });
  if (id.userId != userId || !isAdmin) {
    throw new BadRequestError("a user can only delete reviews that he created");
  }

  const review = await Review.findByIdAndRemove({
    _id: reviewId,
    userId: userId,
  });

  if (!review) {
    throw new NotFoundError(`no review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
  CreateProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  addReview,
  deleteReview,
};
