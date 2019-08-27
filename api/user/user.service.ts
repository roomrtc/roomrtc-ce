import { Injectable } from '@kites/common';

@Injectable()
export class UserService {

  public getAll(): string {
    return 'Get all user!!!';
  }

  public create(user: any) {
    console.log('Create user: ', user);
    return { _id: Date.now(), ...user };
  }

  public get(speaker: string, id: string) {
    return `Get details: ${id}`;
  }

  public update(user: string) {
    return `Update: ${user}`;
  }

  public delete(user: string) {
    return `Delete user "${user}"!`;
  }
}
