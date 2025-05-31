const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    location: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favoriteCoins: [{type: String}]
}, { timestamps: true })

module.exports = model('User', UserSchema)