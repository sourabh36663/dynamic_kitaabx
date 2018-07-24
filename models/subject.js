var mongoose = require("mongoose");

var subjectSchema = new mongoose.Schema({
    title: String,
    url: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    },
    year: Number,
    branch: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
});

module.exports = mongoose.model("Subject", subjectSchema);