import mongoose from 'mongoose';

const SearchKeywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now },
  trendPercentage: String // calculated periodically
});

SearchKeywordSchema.index({ count: -1 });

export default mongoose.model('SearchKeyword', SearchKeywordSchema);