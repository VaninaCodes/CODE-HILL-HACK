import { seedTags } from "./tag.seeder.js";
import { seedUsers } from "./user.seeder.js";
import { seedPosts } from "./post.seeder.js";
import { seedEvents } from "./event.seeder.js";
import { seedAttendances } from "./attendance.seeder.js";
import { seedPosts } from "./post.seeder.js";   // no existe, el archivo exporta seedUsers
import { seedEvents } from "./event.seeder.js"; // no existe, el archivo exporta seedUsers
// Corre todos los seeders en orden (respetando dependencias entre ellos)
export const runSeeders = async () => {
    await seedTags();
    await seedUsers();
    await seedPosts();
    await seedEvents();
    await seedAttendances();
    console.log("Seed completo correctamente.");
};

export default runSeeders;