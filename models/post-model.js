const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: { type: String, required: true },
    imageUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true })

module.exports = model('Post', PostSchema)