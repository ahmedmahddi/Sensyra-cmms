import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { MovementType } from '@prisma/client';

export class AdjustStockDto {
  @IsEnum(MovementType)
  type: MovementType;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  referenceType?: string; // WorkOrder, Adjustment

  @IsString()
  @IsOptional()
  referenceId?: string;
}
