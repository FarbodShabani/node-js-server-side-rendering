const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/edit-product",
    editProduct: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const { editProduct } = req.query;
  if (editProduct !== "true") {
    return res.redirect("/");
  }
  const { productId } = req.params;
  req.user.getProducts({where: {id : productId}}).then((products) => {
    const product = products[0];
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editProduct: true,
      product: product,
    });
  }).catch((err) =>{
     console.log("finding product :" , err);
     res.redirect("/admin/products");
    });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  req.user.createProduct({ title, imageUrl, price, description }).then(() => res.redirect("/admin/products")).catch((err) => console.log('error for inserting Data in to data base', err));
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  Product.findByPk(productId).then((product) => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  }).then(() => res.redirect("/admin/products")).catch((err) => console.log("editing file" , err));
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user.getProducts({where: {id: productId}}).then((products) => {return products[0].destroy()}).then(() => res.redirect("/admin/products")).catch((err) => console.log("error in deleting product", err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log("error when fatching data from database", err));
};
