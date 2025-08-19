import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCommentRequestDto {
  @IsDefined()
  @IsString()
  authorId: string;

  @IsDefined()
  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsDefined()
  @IsString()
  content: string;
}
