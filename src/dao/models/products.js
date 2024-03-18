import mongoose from "mongoose";

const productsCollection = 'products'
const productsSchema = mongoose.Schema({
    title: String,
    description: String,
    code: {
      type: String,
      unique: true,
    },
    price: Number,
    status: {
      type: Boolean,
      default: true,
    },
    stock: Number,
    category: String,
    thumbnails: Array,
})

const productsModel = mongoose.model(productsCollection, productsSchema)
export default productsModel;