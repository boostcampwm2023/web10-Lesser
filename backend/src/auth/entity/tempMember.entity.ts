import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TempMember extends BaseEntity {
  @PrimaryColumn()
  uuid: string;

  @Column()
  temp_id_token: string;

  @Column()
  github_id: number;

  @Column()
  username: string;

  @Column()
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  static of(
    uuid: string,
    tempIdToken: string,
    githubId: number,
    username: string,
    image_url: string,
  ) {
    const newTempMember = new TempMember();
    newTempMember.uuid = uuid;
    newTempMember.temp_id_token = tempIdToken;
    newTempMember.github_id = githubId;
    newTempMember.username = username;
    newTempMember.image_url = image_url;
    return newTempMember;
  }
}
