const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
});

module.exports = mongoose.model('Quotation', QuotationSchema);