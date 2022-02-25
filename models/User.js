const { Schema, model } = require('mongoose');

const NAME_PATTERN = /^[a-zA-Z-]+$/;
const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    firstName: { type: String, min: [3, 'First name must be at least 3 characters long'], validate: {
        validator(value) {
            return NAME_PATTERN.test(value);
        },
        message: 'First name may contain only english letters'
    } },
    lastName: { type: String, min: [5, 'Last name must be at least 5 characters long'], validate: {
        validator(value) {
            return NAME_PATTERN.test(value);
        },
        message: 'Last name may contain only english letters'
    } },
    email: { type: String, required: true, validate: {
        validator(value) {
            return EMAIL_PATTERN.test(value);
        },
        message: 'Invalid email'
    } },
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;