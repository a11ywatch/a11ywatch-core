import { extendUser } from "@app/core/models/user/model";
import { userParams } from "@app/core/utils/controller-filter";
import { connect } from "@app/database";
import { User } from "@app/types/types";

export const getUsers = async (chain?: boolean, count: number = 20) => {
  try {
    const [collection] = await connect("Users");
    const users = await collection.find().limit(count).toArray();
    return chain ? [users, collection] : users;
  } catch (e) {
    console.error(e);
  }
};

export const getAllUsers = async (chain?: boolean) => {
  try {
    return await getUsers(chain, 10000);
  } catch (e) {
    console.error(e);
  }
};

type GetUserParams = {
  email?: string;
  id?: number;
  emailConfirmCode?: string;
};

async function getUser({
  email,
  id,
  emailConfirmCode,
}: GetUserParams): Promise<[User, any]> {
  const params = userParams({ email, id, emailConfirmCode });
  let user;

  try {
    const [collection] = await connect("Users");

    // only perform find if keys exist
    if (Object.keys(params).length) {
      user = extendUser(await collection.findOne(params));
    }

    return [user, collection];
  } catch (e) {
    console.error(e);
    return [null, null];
  }
}

export { getUser };
