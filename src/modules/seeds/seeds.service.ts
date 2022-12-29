import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hashSync } from 'bcrypt';
import { User } from 'modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { usersSeed } from './data/users.seed';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUsers() {
    const salt = await genSalt(+process.env.SALT_VALUE);

    for (const user of usersSeed) {
      user.password = hashSync(user.password, salt);
    }

    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(usersSeed)
        .execute();

      return true;
    } catch (err) {
      return false;
    }
  }
}
