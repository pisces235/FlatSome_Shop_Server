const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const mongooseDelete = require('mongoose-delete')


const Product = mongoose.Schema({
    categories: Array,
    name: String,
    color: Array,
    gallery: Array,
    price: Number,
    description: String,
    stock: Number,
    sold: { type: Number, default: 0 },
    sale: { type: Number, default: 0 },
    featured: Boolean,
    reviews: Array,
    slug: { type: String, slug: 'name', unique: true },
}, { timestamps: true });
// Add plugins
mongoose.plugin(slug);
Product.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

module.exports = mongoose.model("Product", Product)
