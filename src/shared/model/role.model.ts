import { RolesEnum } from '../const/roles.const';

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum];
