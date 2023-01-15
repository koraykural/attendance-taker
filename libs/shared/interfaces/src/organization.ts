import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum OrganizationUserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
}

export const RoleOrderMap = {
  [OrganizationUserRole.Owner]: 1,
  [OrganizationUserRole.Admin]: 2,
  [OrganizationUserRole.Member]: 3,
};

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

export abstract class OrganizationListResponse {
  organization: {
    id: string;
    name: string;
    createdAt: Date;
  };
  myRole: OrganizationUserRole;
  joinedAt: Date;
}

export abstract class OrganizationUser {
  id: string;
  email: string;
  fullName: string;
  role: OrganizationUserRole;
  joinedAt: Date;
}

export abstract class OrganizationDetailsResponse {
  id: string;
  name: string;
  createdAt: Date;
  myRole: OrganizationUserRole;
  users: OrganizationUser[];
}
