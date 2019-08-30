import { Injectable, Inject } from '@kites/common';
import { UserModel, User } from '../models';
import { KITES_INSTANCE, KitesInstance } from '@kites/core';

@Injectable()
export class UserService {

  constructor(
    @Inject(KITES_INSTANCE) private kites: KitesInstance,
  ) { }

  public getAll(): string {
    return 'Get all user!!!';
  }

  create(user: User) {
    if (!user || !user.username) {
      throw new Error('User is required: username!');
    }
    this.kites.logger.info('Create new user: ' + user.username);
    return UserModel.create(user);
  }

  async get(username: string) {
    let user: User = await UserModel.findOne({ username });
    if (!user) {
      user = new User();
      user.username = username;
      user = await this.create(user);
    }

    this.kites.logger.info('Get details: ' + username);

    return user;
  }

  public update(user: string) {
    return `Update: ${user}`;
  }

  public delete(user: string) {
    return `Delete user "${user}"!`;
  }
}
