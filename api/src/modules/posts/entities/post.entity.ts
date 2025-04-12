import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255 })
  category: string;

  @Column('text')
  description: string;

  @Column('text')
  content: string;

  @Column('timestamp')
  date: Date;

  // TODO: Save not only the path
  @Column({ length: 255 })
  image: string;

  // TODO: One to many
  @Column({ length: 255 })
  creator: string;

  @Column('int')
  likes: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // comment can be like ->
  // user
  // post
  // content
  // date
}
