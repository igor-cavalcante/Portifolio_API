const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, //Base64 encoded image
    require: true,
  },
});


const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;


