import { ClassType } from '@/shared/class-type.enum';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetPostsRequestDto {
  @IsDefined()
  @IsEnum(ClassType)
  classType: ClassType;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  limit: number;

  @IsOptional()
  @IsString()
  cursor?: string;
}
