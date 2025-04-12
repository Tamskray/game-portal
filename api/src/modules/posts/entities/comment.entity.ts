import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post' })
  post: Post;

  @Column({ length: 255 })
  user: string;

  // TODO:
  //   @ManyToOne(() => User, (user) => user.comments)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;
}
