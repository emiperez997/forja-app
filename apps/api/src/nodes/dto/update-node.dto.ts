import {
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  ValidateIf,
} from 'class-validator';

export class UpdateNodeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: unknown;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @IsOptional()
  @IsInt()
  position?: number;
}
