import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
  category: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    minLength: [5, "Category Name Must be atleast 5 Characters Long"],
  },
  slug: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    minLength: [5, "Slug Must be atleast 5 charcaters Long"],
  },
});

const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
