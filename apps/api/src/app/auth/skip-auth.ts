import { SetMetadata } from '@nestjs/common';

export const SkipAuthMeta = 'SKIP_AUTH_META';

export const SkipAuth = () => SetMetadata(SkipAuthMeta, true);
