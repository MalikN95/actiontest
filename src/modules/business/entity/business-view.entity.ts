import { Business } from 'modules/business/entity/business.entity';
import { User } from 'modules/user/entity/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['user', 'business'])
export class BusinessViewHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.businessViewHistory, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Business, (business) => business.businessViewHistory, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @UpdateDateColumn()
  lastView: Date;
}
