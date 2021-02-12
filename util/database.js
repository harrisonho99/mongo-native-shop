const MongoClient = require('mongodb').MongoClient;

let _db;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoConnect = (cb) => {
  client.connect((err) => {
    if (err) {
      throw err;
    }

    cb(client);
    _db = client.db();
  });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error('no DB found!');
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
