import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export abstract class ChangeUserRolesDto {
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  userIdsToAdmin?: string[];

  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  userIdsToMember?: string[];

  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  userIdsToRemove?: string[];
}

export abstract class AddMembersDto {
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  userIds: string[];
}

export abstract class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
