import BaseService, { METHODS } from "@/common/services/BaseService";

class AuthService extends BaseService {
  constructor(prefix: string) {
    super(prefix);
  }

  async postUserData(data: Record<string, string>)  {
    return await this.performRequest(METHODS.POST, 'user/create', data);
  }

  async userLogin(data: Record<string, string>)  {
    return await this.performRequest(METHODS.POST, 'auth/login', data);
  }

}

export default new AuthService('v1');
