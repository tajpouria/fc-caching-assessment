import { IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateDataDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  value: string;
}
