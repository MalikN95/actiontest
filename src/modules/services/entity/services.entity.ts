import { Business } from 'modules/business/entity/business.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServicesTypesEnum } from '../enums/services.enum';

@Entity('services')
export class Services {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceTitle: string;

  @Column()
  serviceDescription: string;

  @Column({ type: 'enum', enum: ServicesTypesEnum, nullable: false })
  serviceType: ServicesTypesEnum;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Business, (business) => business.services, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
