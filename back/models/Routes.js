const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const routesSchema = new Schema({
  mines: Number,
  time: Number,
  distance: Number,
  ownerRobot: { type: Schema.ObjectId, ref: 'Robots' },
  userId: { type: Schema.ObjectId, ref: 'User' }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('Route', routesSchema);
module.exports = User;
