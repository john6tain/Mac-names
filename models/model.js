const mongoose = require('mongoose');

let peopleSchema =  mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    MAC: { type: mongoose.Schema.Types.String,required: true }, 
})
let People = mongoose.model('People', peopleSchema);
module.exports = People;