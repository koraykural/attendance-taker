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

export abstract class SessionListResponseItem {
  id: string;
  name: string;
  createdAt: Date;
  endedAt: Date | null;
  attendeeCount: number;
}

export abstract class SessionAttendee {
  userId: string;
  email: string;
  fullName: string;
  attendedAt: Date;
}

export abstract class SessionDetails {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  createdByEmail: string;
  createdByFullName: string;
  createdAt: Date;
  endedAt: Date | null;
  attendees: SessionAttendee[];
}

export abstract class AttendanceCodeStreamData {
  active: boolean;
  code?: string;
}
