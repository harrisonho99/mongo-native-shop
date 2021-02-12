const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class User {
  constructor(userName, email, cart, userId) {
    this.name = userName; //string
    this.email = email; // string
    this.cart = cart; // { items : [list items]}
    this._id = userId; // ObjectID(id)
  }
  save = () => {
    const db = getDb();
    db.collection('users')
      .insertOne(this)
      .catch((err) => {
        console.log(err);
      });
  };
  addToCart = (product) => {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db.collection('users').updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      {
        $set: { cart: updatedCart },
      }
    );
  };
  getCart = async () => {
    try {
      const db = getDb();
      const productIds = this.cart.items.map((prod) => prod.productId);
      const products = await db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray();
      let cartProducts = products.map((product) => ({
        ...product,
        quantity: this.cart.items.find(
          (item) => product._id.toString() === item.productId.toString()
        ).quantity,
      }));
      return cartProducts;
    } catch (error) {
      throw error.message;
    }
  };
  deleteItemsFromCart = async (productId) => {
    try {
      const newCartItems = this.cart.items.filter(
        (item) => productId.toString() !== item.productId.toString()
      );
      if (newCartItems.length === this.cart.items.length) {
        throw Error('Invalid Deleting!');
      }
      const db = getDb();
      let updatedCartItems = await db.collection('users').updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        {
          $set: { 'cart.items': newCartItems },
        }
      );
      return updatedCartItems;
    } catch (error) {
      throw error;
    }
  };

  addOrder = async () => {
    try {
      const order = {
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name,
        },
        items: await this.getCart(),
      }; // {user : objecId(string),name : string , items : Products[]}
      const db = getDb();
      await db.collection('orders').insertOne(order);
      this.cart = { items: [] };
      return db.collection('users').updateOne(
        {
          _id: new mongodb.ObjectId(this._id),
        },
        { $set: { cart: { items: [] } } }
      );
    } catch (error) {
      throw error;
    }
  };
  getOrders = async () => {
    try {
      const db = getDb();
      const cursor = await db
        .collection('orders')
        .find({ 'user._id': new mongodb.ObjectId(this._id) });

      return await cursor.toArray();
    } catch (error) {
      throw error;
    }
  };
  static findById = async (userId) => {
    try {
      const db = getDb();
      let stringedId = new mongodb.ObjectId(userId);
      let collection = db.collection('users');
      let queryUser = await collection.find({ _id: stringedId });
      let user = queryUser.next();
      return user;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = User;
