import BaseService, { METHODS } from "@/common/services/BaseService";

class UserService extends BaseService {
  constructor(prefix: string) {
    super(prefix);
  }

  async postUserData(data: Record<string, any>)  {
    return await this.performRequest(METHODS.POST, 'user/create', data);
  }
  async postUserDataProviders(data: Record<string, any>)  {
    return await this.performRequest(METHODS.POST, 'user/provider/create', data);
  }
  async getUserDataById(userId: string) {
    return await this.performRequest(METHODS.GET, `user/${userId}`);
  }
  async getUserDataByEmail(email: unknown) {
    const result = await this.performRequest(METHODS.GET, `user/email/search/${email}`);
    console.log({result});
    
    return result;
  }

}

export default new UserService('v1');
