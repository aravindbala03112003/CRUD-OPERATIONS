const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema(
  {
    paperId: {
      type: String,
      required: [true, 'Paper ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^P-\d+$/i, 'Paper ID must follow format like P-105 or P-3050'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author must be at least 2 characters long'],
      maxlength: [120, 'Author cannot exceed 120 characters'],
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high performance querying, sorting, and unique enforcement
paperSchema.index({ publicationDate: -1 });
paperSchema.index({ price: 1 });
paperSchema.index({ author: 1 });
paperSchema.index({ title: 'text', author: 'text', paperId: 'text' });

const Paper = mongoose.models.Paper || mongoose.model('Paper', paperSchema);

module.exports = Paper;
