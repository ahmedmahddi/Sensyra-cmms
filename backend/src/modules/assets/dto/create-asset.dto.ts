import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { AssetStatus } from '@prisma/client';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  assetTag: string; // Barcode/QR code content

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasePrice?: number;
}
