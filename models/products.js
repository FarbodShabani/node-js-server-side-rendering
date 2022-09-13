const Sequelize = require("sequelize");

const sequelize = require("../util/database");




const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Product ;











// const fs = require("fs");
// const path = require("path");

// const rootDir = require("../util/path");
// const db = require("../util/database");
// const Cart = require("./cart");

// const productPath = path.join(rootDir, "data", "products.json");

// const readProductsFromFile = (cb) => {
//     fs.readFile(productPath, (err, fileContent) => {
//       if (!err) {
//         if(fileContent.length > 0) 
//         return cb(JSON.parse(fileContent));
//         else 
//         return cb([]);
//       }
//       cb([]);
//     });
// }

// module.exports = class Product {
//   constructor(id, title, imageUrl, price, description) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//   }

//   save() {
//     return db.execute("INSERT INTO products (title, imageUrl, description, price) VALUE (?, ?, ?, ?)",[this.title, this.imageUrl, this.description, this.price])
//   };

//   static delete(id, cb){
//     readProductsFromFile((products) => {
//       const deletedProduct = products.find((product) =>product.id === id);
//       const updatedProducts = products.filter((product) => product.id !== id);
//       fs.writeFile(productPath, JSON.stringify(updatedProducts), (err) => {
//         if(err)
//         console.log("error in creating product", err);
//       });
//       Cart.deleteFromCart(id, deletedProduct.price, cb);
//     });
//   }
  
//   static fetchAll() {
//   return db.execute("SELECT * FROM products");
//   }
  
//   static findProductById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id =?",[id])
//   }
// };
