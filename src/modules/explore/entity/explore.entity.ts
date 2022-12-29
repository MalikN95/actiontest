import { Business } from 'modules/business/entity/business.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExploreTypesEnum } from '../enums/explore.enum';

@Entity('explore')
export class Explore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exploreTitle: string;

  @Column()
  exploreDescription: string;

  @Column({ type: 'enum', enum: ExploreTypesEnum, nullable: false })
  exploreType: ExploreTypesEnum;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Business, (business) => business.explore, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
