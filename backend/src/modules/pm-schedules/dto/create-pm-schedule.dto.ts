import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { PMFrequency } from '@prisma/client';

export class CreatePMScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsEnum(PMFrequency)
  frequency: PMFrequency;

  @IsNumber()
  @Min(1)
  @IsOptional()
  interval?: number;

  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @IsUUID()
  @IsOptional()
  procedureId?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}
