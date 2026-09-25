import User from "./user.js";
import Tag from "./tag.js";
import UserTag from "./userTag.js";
import Post from "./post.model.js";
import PostTag from "./post_tag.model.js";
import Event from "./event.model.js";
import EventTag from "./event_tag.model.js";
import EventAttendance from "./event_attendace.model.js";

// ----- Usuario <-> Etiquetas (intereses) -----
User.belongsToMany(Tag, {
    through: UserTag,
    foreignKey: "userId",
    otherKey: "tagId",
    as: "tags",
});

Tag.belongsToMany(User, {
    through: UserTag,
    foreignKey: "tagId",
    otherKey: "userId",
    as: "users",
});

UserTag.belongsTo(User, {
    foreignKey: "userId",
});

UserTag.belongsTo(Tag, {
    foreignKey: "tagId",
});

// ----- Usuario <-> Publicaciones -----
User.hasMany(Post, {
    foreignKey: "userId",
    as: "posts",
});

Post.belongsTo(User, {
    foreignKey: "userId",
    as: "author",
});

// ----- Publicaciones <-> Etiquetas -----
Post.belongsToMany(Tag, {
    through: PostTag,
    foreignKey: "postId",
    otherKey: "tagId",
    as: "tags",
});

Tag.belongsToMany(Post, {
    through: PostTag,
    foreignKey: "tagId",
    otherKey: "postId",
    as: "posts",
});

PostTag.belongsTo(Post, {
    foreignKey: "postId",
});

PostTag.belongsTo(Tag, {
    foreignKey: "tagId",
});

// ----- Usuario <-> Eventos (organizador) -----
User.hasMany(Event, {
    foreignKey: "userId",
    as: "events",
});

Event.belongsTo(User, {
    foreignKey: "userId",
    as: "organizer",
});

// ----- Eventos <-> Etiquetas -----
Event.belongsToMany(Tag, {
    through: EventTag,
    foreignKey: "eventId",
    otherKey: "tagId",
    as: "tags",
});

Tag.belongsToMany(Event, {
    through: EventTag,
    foreignKey: "tagId",
    otherKey: "eventId",
    as: "events",
});

EventTag.belongsTo(Event, {
    foreignKey: "eventId",
});

EventTag.belongsTo(Tag, {
    foreignKey: "tagId",
});

// ----- Eventos <-> Usuarios (confirmacion de asistencia/stand) -----
Event.belongsToMany(User, {
    through: EventAttendance,
    foreignKey: "eventId",
    otherKey: "userId",
    as: "attendees",
});

User.belongsToMany(Event, {
    through: EventAttendance,
    foreignKey: "userId",
    otherKey: "eventId",
    as: "eventsAttending",
});

EventAttendance.belongsTo(Event, {
    foreignKey: "eventId",
});

EventAttendance.belongsTo(User, {
    foreignKey: "userId",
});

export {
    User,
    Tag,
    UserTag,
    Post,
    PostTag,
    Event,
    EventTag,
    EventAttendance,
};