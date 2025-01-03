import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { User } from 'src/entity/User.entity';

export class PasswordLinkDto {
  
  @IsOptional()
  id?: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;

  @IsNotEmpty({ message: 'userId is required' })
  @IsString()
  userId: string;

  @IsOptional()
  user?: User;
}
