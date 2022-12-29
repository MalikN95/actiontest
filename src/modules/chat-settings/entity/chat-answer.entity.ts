import { Business } from 'modules/business/entity/business.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatAnswer')
export class ChatAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 40 })
  answer: string;

  @ManyToOne(() => Business, (business) => business.chatAnswer, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
