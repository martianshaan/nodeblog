const { Schema, model, SchemaType } = require('mongoose');


const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        reqired: false
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
}
)

const Blog = model('Blog', blogSchema);

module.exports = { Blog }