const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");
const appController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/products");
const User = require("./models/user");
const Cart = require("./models/cart");
const Order = require("./models/order");
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
    User.findByPk(1).then((user) => {
        req.user = user;
        next();
    }).catch((err) => {
        console.log('error setting User in request: ', err);
    })
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(appController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Cart.belongsTo(User);
Order.belongsTo(User);
User.hasOne(Cart);
User.hasMany(Product);
User.hasMany(Order);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsToMany(Product, {through: OrderItem});


sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
     return User.findByPk(1);
  }).then((user) => {
      if (!user) {
        return  User.create({name: "saina", email: "farbod@saina.com"})
      }
      return user;
  }).then((user) => {
    return user.createCart();
    return 
  }).then(() => {
    app.listen(2828);
  })
  .catch((err) => console.log("error when sequelize sync", err));
