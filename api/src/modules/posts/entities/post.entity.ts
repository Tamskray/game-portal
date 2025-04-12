import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // TODO: relation
  @Column('text', { array: true })
  comments: string[];

  // comment can be like ->
  // user
  // post
  // content
  // date
}
