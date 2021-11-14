import User from '../models/user.model';
import db from '../db';
import DataBaseError from '../models//errors/database.error.model';

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
    try {
      const query = `
        SELECT
          uuid,
          userName
        FROM
          application_user
        WHERE
          uuid = $1
      `;
      const values = [uuid];
      const { rows: queryResultRows } = await db.query<User>(query, values);
      const [ user ] = queryResultRows;
      return queryResultRows;
    } catch (error) {
      throw new DataBaseError(`Query Error: ${error}`);
    };
  };

  async findByUserNameAndPassword(userName: string, password: string): Promise<User | null> {
    try {
      const query = `
        SELECT
          uuid,
          userName
        FROM
          application_user
        WHERE
          userName = $1 AND
          password = crypt($2, 'my_salt')
      `;
      const values = [userName, password];
      const { rows: queryResultRows } = await db.query<User>(query, values);
      const [ user ]  = queryResultRows;
      return user || null;  
    } catch (error) {
      throw new DataBaseError('Error trying to consult using username and password.')
    }
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

  async updateUser(user: User): Promise<Void> {
    const script = `
      UPDATE
        application_user 
      SET
        userName = $1,
        password = crypt($2, 'my_salt')
      WHERE
        uuid = $3
    `;
    const values = [user.userName, user.password, user.uuid];
    await db.query<{ uuid: string }>(script, values);
  };

  async deleteUser(uuid: string): Promise<void> {
    const script = `
      DELETE FROM
        application_user
      WHERE
        uuid = $1
    `;
    const values = [uuid];
    await db.query(script, values);
  };
};


export default new UserRepository();
