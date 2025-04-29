module.exports = class GetByIdDto {
    name; 
    email;
    id;
    isActivated;
    followers;
    following;

    constructor(model) {
        this.name = model.name;
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.followers = model.followers;
        this.following = model.following;
    }
}