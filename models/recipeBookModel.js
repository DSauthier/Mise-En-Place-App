const mongoose = require('mongoose');
// create a new schema object
const Schema = mongoose.Schema;



const BooksSchema = new Schema({
  name: String,
  recipes: [{type: Schema.Types.ObjectId, ref: "Recipe"}],
  image: { type: String, default: "/images/pexels-photo-1029141.jpeg "},
  author: { type: Schema.Types.ObjectId, ref: 'User'}
},
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  });


const Books = mongoose.model('Books', BooksSchema);


module.exports = Books;