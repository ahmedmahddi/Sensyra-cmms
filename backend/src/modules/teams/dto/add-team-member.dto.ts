import { IsUUID, IsOptional, IsString } from 'class-validator';

export class AddTeamMemberDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  role?: string; // Lead, Member
}
