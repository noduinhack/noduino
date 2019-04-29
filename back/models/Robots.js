const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const robotSchema = new Schema({
  name: String,
  distance: Number,
  picture: String,
  mines: Number,
  pines: Object,
  routes: { type: Schema.ObjectId, ref: 'Routes' }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Robots = mongoose.model('Robots', robotSchema);
module.exports = Robots;
