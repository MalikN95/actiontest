import { Business } from 'modules/business/entity/business.entity';
import { User } from 'modules/user/entity/user.entity';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBusiness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role: RoleEnum;

  @ManyToOne(() => User, (user) => user.userBusiness, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Business, (business) => business.userBusiness, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
