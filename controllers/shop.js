const Cart = require('../models/cart');
const Product = require('../models/products');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  }).catch((err) => console.log('error in get products: ', err));
};

exports.getProduct = (req, res, next) => {
  const {productId} = req.params;
  // Product.findAll({where: {id : productId}}).then((products) => {
  //   res.render("shop/product-detail", {product: products[0], path: "/products", pageTitle: products.title})
  // }).catch((err) => console.log(err));
  Product.findByPk(productId).then((product) => {
    res.render("shop/product-detail", {product: product, path: "/products", pageTitle: product.title})
  }).catch((err) => console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err) => console.log('error in fetching All data', err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart) => {
    cart.getProducts().then((products) => {
      if (products?.length <= 0) {
        return res.render('shop/cart', {
           path: '/cart',
           pageTitle: 'Your Cart',
           cartProducts: []
         });
       } else {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          cartProducts: products,
        });
       }
    }).catch((err) => console.log("error in getting products of cart",err));
  }).catch((err) => console.log("error in getting the user Cart",err))
  }

exports.postCart = (req, res, next) => {
  const {productId} = req.body;
  let fetchedCart ;
  let newQuantites = 1;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    cart.getProducts({where: {id : productId}}).then((products) => {
      let product;
      if(products.length > 0){
        product = products[0];
      }
      if (product != undefined) {
        const oldQuantity = product.cartItem.quantity;
        newQuantites = oldQuantity + 1;
      }
      return Product.findByPk(productId)
    }).then((product) => {
      return fetchedCart.addProduct(product, {through: {quantity: newQuantites}})
     }).catch((err) => console.log("error when adding new product to cart" , err)).then(() => {
      res.redirect("/cart")
    }).catch((err) => console.log("getting cart products :",err));
  }).catch((err) => console.log('getting user cart for adding product to cart', err));
}

exports.postDeleteCartItem = (req, res, next) => {
  const {productId} = req.body;
  req.user.getCart().then((cart) => {
    return cart.getProducts({where: {id: productId}})
  }).then((products) => {
    const product = products[0];
    return product["cart-item"].destroy();
  }).then(() => res.redirect("cart")).catch((err) => console.log("error when deleting Cart Item", err));
}

exports.postOrders = (req, res, next) => {
  let fetchedCart = null;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    return cart.getProducts();
  }).then((products) => {
    return req.user.createOrder().then((order) => {
      order.addProduct(products.map((product) =>{
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }))
    }).then(() => fetchedCart.setProducts(null)).then(() => res.redirect("/orders")).catch((err) => console.log('creatingOrders', err));
  }).catch((err) => console.log("creating Cart error : ", err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ["products"]}).then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders
    });
  }).catch((err) => console.log("get all orders error : ", err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
