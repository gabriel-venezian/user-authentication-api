import User from '../models/user.model';
import db from '../db';

class UserRepository {
  async findAllUsers(): Promise<User[]> {
    const query = `
      SELECT 
        uuid,
        userName 
      FROM 
        application_user
    `;
    const { rows: queryResultRows } = await db.query<User[]>(query);
    return queryResultRows || [];
  };

  async findById(uuid: string): Promise<User> {
    const query = `
      SELECT
        uuid,
        username
      FROM
        application_user
      WHERE
        uuid = $1
    `;
    const values = [uuid];
    const { rows: queryResultRows } = await db.query<User>(query, values);
    const [ user ] = queryResultRows;
    return queryResultRows;
  };

  async addUser(user: User): Promise<string> {
    const script = `
      INSERT INTO
        application_user (
          userName,
          password
        )
        VALUES (
          $1,
          crypt($2, 'my_salt')
        )
        RETURNING 
          uuid
    `;
    const values = [user.userName, user.password];
    const { rows: queryResultRows } = await db.query<{ uuid: string }>(script, values);
    const [ newUser ] = queryResultRows;
    return newUser.uuid;
  };
};


export default new UserRepository();
