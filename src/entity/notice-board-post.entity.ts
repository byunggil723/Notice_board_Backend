import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  VersionColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { ClassType } from '@/shared/class-type.enum';

@Entity()
export class NoticeBoardPost {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'class_type',
    type: 'enum',
    enum: ClassType,
  })
  classType: ClassType;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author' })
  author: User;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content' })
  content: string;

  @OneToMany(() => Comment, (commnet) => commnet.post)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
