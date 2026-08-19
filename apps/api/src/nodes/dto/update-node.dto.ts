import { IsOptional, IsString, IsUUID, IsInt } from 'class-validator';

export class UpdateNodeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: unknown; // JSON de Tiptap

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
