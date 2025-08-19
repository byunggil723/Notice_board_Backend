import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateCommentRequestDto {
  @IsDefined()
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  content?: string;
}
