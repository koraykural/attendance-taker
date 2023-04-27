import { IsNotEmpty, IsString } from 'class-validator';

export abstract class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}

export abstract class CreateSessionResponseDto {
  sessionId: string;
}
