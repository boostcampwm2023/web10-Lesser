import { Member } from 'src/member/entity/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LoginMember {
  @PrimaryColumn()
  member_id: number;

  @OneToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  refresh_token: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(memberId: number, refreshToken: string) {
    const newRefreshToken = new LoginMember();
    newRefreshToken.member_id = memberId;
    newRefreshToken.refresh_token = refreshToken;
    return newRefreshToken;
  }
}
