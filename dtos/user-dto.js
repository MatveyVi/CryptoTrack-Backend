module.exports = class UserDto {
    name; 
    email;
    id;
    isActivated;
    avatarUrl;
    bio;
    location;
    followers;
    following;

    constructor(model) {
        this.name = model.name;
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.avatarUrl = model.avatarUrl;
        this.bio = model.bio;
        this.location = model.location;
        this.followers = model.followers;
        this.following = model.following;
    }
}