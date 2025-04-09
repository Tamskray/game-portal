import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  date: string;

  // TODO: Save not only the path
  @Column({ nullable: true })
  image: string;

  // TODO: One to many
  @Column({ nullable: true })
  creator: string;

  @Column({ type: 'jsonb' })
  likes: Record<string, boolean>;

  // TODO: relation
  @Column({ type: 'text', array: true })
  comments: string[];

  // comment can be like ->
  // user
  // post
  // content
  // date
}
