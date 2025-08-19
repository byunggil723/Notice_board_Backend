import { ClassType } from '@/shared/class-type.enum';

class AuthorDto {
  id: string;
  nickname: string;
}

export class UpdatePostResponseDto {
  success: boolean;
  updatedPost?: {
    id: string;
    classType: ClassType;
    author: AuthorDto;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
  latestPost?: {
    id: string;
    classType: ClassType;
    author: AuthorDto;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}
