import BaseService, { METHODS } from "@/common/services/BaseService";

class AccountService extends BaseService {
  constructor(prefix: string) {
    super(prefix);
  }

  async postAccountData(data: unknown)  {
    return await this.performRequest(METHODS.POST, 'account/create', data);
  }
  async getAccountDataByUserId(userId: string) {
    return await this.performRequest(METHODS.GET, `account/user/${userId}`);
  }
  async getAccountDataByProviderId(providerId: string) {
    return await this.performRequest(METHODS.GET, `account/provider/${providerId}`);
  }

}

export default new AccountService('v1');
