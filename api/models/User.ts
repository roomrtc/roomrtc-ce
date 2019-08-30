import { prop, Typegoose, ModelType, InstanceType, pre, instanceMethod } from 'typegoose';
import * as jwt from 'jsonwebtoken';

@pre<User>('save', async function(next) {
  try {
    this.stars = 0;

    if (this.isModified('password') || this.isNew) {
      // let salt = await bcrypt.genSalt( 10 );
      // let hash = await bcrypt.hash( this.password, salt, null );
      this.password = 'hash';
    }
    return next();
  } catch (error) {
    return next(error);
  }
})
/**
 * Define user class
 */
class User extends Typegoose {
  @prop() username?: string;
  @prop() firstname?: string;
  @prop() lastname?: string;
  @prop() email?: string;
  @prop() password?: string;
  @prop() hashedPassword?: string;
  @prop() groupId?: string;
  @prop() stars?: number;

  @instanceMethod
  public comparePassword(password: string): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      resolve(true);
      // bcrypt.compare( password, this.password )
      //     .then( match => resolve( match ) )
      //     .catch( error => reject( error ) );
    });
  }

  @instanceMethod
  public toAuthJson(this: InstanceType<ModelType<User>> & typeof User) {
    return {
      id: this._id,
      email: this.email,
      token: this.generateToken(),
    };
  }

  @instanceMethod
  public generateToken(this: InstanceType<ModelType<User>> & typeof User) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(String(expirationDate.getTime() / 1000), 10),
    }, 'secret-123');
  }

}

/**
 * Define user model
 */
const UserModel = new User().getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});

export {
  User,
  UserModel,
};
