const getDB = require('../util/database').getDb;
const mongodb = require('mongodb');
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
    this.save();
  }
  save = () => {
    const db = getDB();
    if (this._id) {
      return db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    }
    return db
      .collection('products')
      .insertOne(this)
      .catch((err) => {
        console.log(err);
      });
  };
  static fetchAll = () => {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  static findById = async (prodId) => {
    try {
      const db = getDB();
      let id = await new mongodb.ObjectId(prodId);
      let collection = db.collection('products');
      let queryProduct = await collection.find({ _id: id });
      let product = await queryProduct.next();
      return product;
    } catch (error) {
      throw error.message;
    }
  };
  static deleteProduct = async (id) => {
    try {
      const db = getDB();
      if (typeof id === 'string') {
        return await db
          .collection('products')
          .deleteOne({ _id: new mongodb.ObjectId(id) });
      }
      throw Error('Product Is Incorrect!');
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Product;
