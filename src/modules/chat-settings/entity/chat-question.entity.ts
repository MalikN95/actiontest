import { Business } from 'modules/business/entity/business.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatQuestion')
export class ChatQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 40 })
  question: string;

  @ManyToOne(() => Business, (business) => business.chatQuestion, {
    onDelete: 'CASCADE',
  })
  business: Business;
}
