import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class dataDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  value: string;
}
