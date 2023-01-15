import { IsOptional, IsString } from 'class-validator';

export abstract class SearchUserParams {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  excludeOrgId?: string;
}

export abstract class SearchUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
