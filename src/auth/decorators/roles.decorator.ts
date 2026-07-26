import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/schemas/user.schema';

export const ROLES_KEY = 'roles';

// Decorator to specify which roles are allowed to access a route
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);