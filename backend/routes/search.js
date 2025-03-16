const express = require('express');
const router = express.Router();
const User = require("../models/User");

//Search users by searchQurey
router.post("/", async (req, res) => {
    try {
        const {userid, searchQuery} = req.body;

        //update user search query
        await User.findByIdAndUpdate(userid, { $push: {search: searchQuery} }, { new: true });

        //find users that match the searchQuery
        const matchedUsers = await User.find({search: searchQuery});

        return res.json({users: matchedUsers});
    }
    catch (error) {
        console.error("Search error: ", error);
        res.status(500).json({error: "something went wrong"});
    }
});

module.exports = router;