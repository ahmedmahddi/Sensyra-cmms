import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  filename: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @IsInt()
  size: number;

  @IsString()
  url: string;

  @IsOptional()
  @IsUUID()
  workOrderId?: string;

  @IsOptional()
  @IsUUID()
  workRequestId?: string;
}
