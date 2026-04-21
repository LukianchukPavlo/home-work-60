import { JsonServerRepository } from './base';

export class AuthRepository extends JsonServerRepository {
  constructor() {
    super('users');
  }
}
