import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { PMFrequency } from '@prisma/client';

export class UpdatePMScheduleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PMFrequency)
  @IsOptional()
  frequency?: PMFrequency;

  @IsNumber()
  @Min(1)
  @IsOptional()
  interval?: number;

  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  procedureId?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}
