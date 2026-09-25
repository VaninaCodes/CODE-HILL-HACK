import User from "./user.js";
import Tag from "./tag.js";
import UserTag from "./userTag.js";

User.belongsToMany(Tag, {
    through: UserTag,
    foreignKey: "userId",
    otherKey: "tagId",
});

Tag.belongsToMany(User, {
    through: UserTag,
    foreignKey: "tagId",
    otherKey: "userId",
});

UserTag.belongsTo(User, {
    foreignKey: "userId",
});

UserTag.belongsTo(Tag, {
    foreignKey: "tagId",
});

export {
    User,
    Tag,
    UserTag,
};