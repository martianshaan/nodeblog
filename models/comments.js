const { Schema, model, SchemaType } = require('mongoose');


const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }
}, {
    timestamps: true
}
)

const Comment = model('Comment', commentSchema);

module.exports = { Comment }