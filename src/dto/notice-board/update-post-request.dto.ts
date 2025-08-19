import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdatePostRequestDto {
  @IsDefined()
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
