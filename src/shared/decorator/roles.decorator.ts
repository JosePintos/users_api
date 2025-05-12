import { Reflector } from '@nestjs/core';
import { Role } from '../model/role.model';

export const Roles = Reflector.createDecorator<Role[]>();
