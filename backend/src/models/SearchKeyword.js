import mongoose from "mongoose";

const SearchKeywordSchema = new mongoose.Schema({
    _id: { type: String }, // keyword as id
    count: { type: Number, default: 0 },
    relatedGroups: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    topAnswers: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

export default mongoose.model('SearchKeyword', SearchKeywordSchema);