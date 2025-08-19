import { IsDefined, IsEnum, IsString } from 'class-validator';
import { ClassType } from '@/shared/class-type.enum';

export class CreatePostRequestDto {
  @IsDefined()
  @IsEnum(ClassType)
  classType: ClassType;

  @IsDefined()
  @IsString()
  authorId: string;

  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  content: string;
}
