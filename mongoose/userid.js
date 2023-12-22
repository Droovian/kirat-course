const zod = require('zod');
const crypto = require('crypto');

function generateId() {
    const temp = crypto.randomBytes(4);

    const uniqueId = temp.toString('hex');

    return uniqueId;
}

function generateCourseId() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    
    const randomNumber = Math.floor(100 + Math.random() * 900);

    const courseId = `${prefix}${randomNumber}`;

    return courseId;
}

function validateInput(users) {
    const schema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    });

    const result = schema.safeParse(users);

    return result;
}

module.exports = {
    generateId,
    validateInput,
    generateCourseId
};
