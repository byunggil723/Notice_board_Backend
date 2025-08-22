import { ClassType } from '@/shared/class-type.enum';

class AuthorDto {
  id: string;
  nickname: string;
}

export class CommentDto {
  id: string;
  author: AuthorDto;
  content: string;
  parent: string | null;
  children: CommentDto[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PostDto {
  id: string;
  classType: ClassType;
  author: AuthorDto;
  title: string;
  content: string;
  comments: CommentDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class GetPostsResponseDto {
  posts: PostDto[];
  hasMore: boolean;
}
