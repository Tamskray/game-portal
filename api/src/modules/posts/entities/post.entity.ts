import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  date: string;

  // TODO: Save not only the path
  @Column()
  image: string;

  // TODO: One to many
  @Column()
  creator: string;

  @Column()
  likes: object;

  // TODO: relation
  @Column()
  comments: string[];

  // comment can be like ->
  // user
  // post
  // content
  // date
}
