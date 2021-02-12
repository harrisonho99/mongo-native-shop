const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: `/products/${prodId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/error');
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCart = (req, res, next) => {
  const cartProducts = req.user.getCart();
  cartProducts
    .then((products) => {
      return res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.redirect('/error');
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      return res.redirect('/products');
    })
    .catch((err) => {
      console.error(err);
      res.redirect(err);
    });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemsFromCart(prodId)
    .then(() => {
      return res.redirect('/cart');
    })
    .catch((err) => {
      console.error(err);
      return res.redirect('/error');
    });
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/error');
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/error');
    });
};
