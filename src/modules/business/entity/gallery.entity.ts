import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './business.entity';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  imgUrl: string;

  @ManyToOne(() => Business, (business) => business.gallery, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
