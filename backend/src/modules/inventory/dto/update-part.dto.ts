import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePartDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitCost?: number;

  @IsString()
  @IsOptional()
  location?: string;
}
