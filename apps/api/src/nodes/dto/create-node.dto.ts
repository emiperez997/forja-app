import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNodeDto {
  @IsIn(['folder', 'note'])
  type: 'folder' | 'note' = 'note';

  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
