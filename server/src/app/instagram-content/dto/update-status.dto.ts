import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(['pending', 'approved', 'rejected', 'published'])
  status: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string; // alasan jika ditolak
}