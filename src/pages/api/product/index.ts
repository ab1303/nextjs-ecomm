import { Query } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Products from '@/models/productModel';
import connectDB from '@/utils/connectDB';

connectDB();

export default async function handleProductRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getProducts(req, res);
      break;
    case 'POST':
      await createProduct(req, res);
      break;
  }
}

class APIfeatures {
  query: any;
  queryString: {
    [key: string]: string | string[];
  };
  constructor(
    query: Query<any[], any, Record<string, unknown>, any>,
    queryString: {
      [key: string]: string | string[];
    }
  ) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ['page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category !== 'all')
      this.query.find({ category: queryObj.category });
    if (queryObj.title !== 'all')
      this.query.find({ title: { $regex: queryObj.title } });

    this.query.find();
    return this;
  }

  sorting() {
    if (this.queryString.sort && !Array.isArray(this.queryString.sort)) {
      const sortBy = this.queryString.sort.split(',').join('');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  paginating() {
    const page = !Array.isArray(this.queryString.page)
      ? this.queryString.page
        ? +this.queryString.page * 1
        : 1
      : 1;

    const limit =
      !Array.isArray(this.queryString.limit) || !this.queryString.limit
        ? this.queryString.limit
          ? +this.queryString.limit * 1
          : 6
        : 6;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const features = new APIfeatures(Products.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.query;

    res.json({
      status: 'success',
      result: products.length,
      products,
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);
    if (result && result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { title, price, inStock, description, content, category, images } =
      req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === 'all' ||
      images.length === 0
    )
      return res.status(400).json({ err: 'Please add all the fields.' });

    const newProduct = new Products({
      title: title.toLowerCase(),
      price,
      inStock,
      description,
      content,
      category,
      images,
    });

    await newProduct.save();

    res.json({ msg: 'Success! Created a new product' });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
