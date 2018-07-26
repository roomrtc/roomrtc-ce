'use strict';

/**
 * Users Model
 */
class User {

    /**
     * Table or collection name
     */
    get collection() {
        return 'User';
    }

    /**
     * User schema definition
     */
    get schema() {
        return {
            firstname: String,
            lastname: String,
            username: {
                type: String,
                unique: true,
                required: true
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            hashed_password: {
                type: String,
                required: true
            }
        }
    }

    /**
     * Setup validation, relationships, or define scope, or custom method.
     * @param {schema} schema instance of this model
     * @param {kites} kites instance of kites will pass to get caminte or other models
     */
    setup(schema, kites) {
        console.log('// TODO: Hash user password before save to database store', schema.modelName)
        schema.beforeCreate = function (next) {
            console.log('// TODO: Use bcryptjs to hash user password onCreate and onUpdate');
            this.hashed_password = 'hashed';
            next();
        }
    }
}

module.exports = User;