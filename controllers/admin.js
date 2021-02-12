const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/error');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((productData) => {
      const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl,
        productData._id
      );
      return product.save();
    })
    .then((result) => {
      console.log('-----------UPDATED PRODUCT SUCCESS-----------');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log('====================================');
  // console.log(typeof prodId);
  // console.log('====================================');
  Product.deleteProduct(prodId)
    .then((result) => {
      console.log(result.deletedCount);
      if (result.deletedCount === 1) {
        return res.redirect('/admin/products');
      }
      throw Error('No Product Found!');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
};
