import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

/**
 * Define user model
 */
class User extends Typegoose {
  @prop() username?: string;
  @prop() firstname?: string;
  @prop() lastname?: string;
  @prop() email?: string;
  @prop() hashedPassword?: string;
}

const UserModel = new User().getModelForClass(User);

export {
  User,
  UserModel,
};
