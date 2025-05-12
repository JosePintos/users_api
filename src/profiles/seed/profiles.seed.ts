import { Model } from 'mongoose';
import { Profile } from '../schema/profile.schema';

export const seedProfiles = async (profileModel: Model<Profile>) => {
  const existing = await profileModel.countDocuments();

  if (existing === 0) {
    await profileModel.insertMany([
      { code: 'ADMIN', name: 'Administrador' },
      { code: 'USER', name: 'Usuario' },
      { code: 'MOD', name: 'Moderador' },
    ]);

    console.log('Perfiles iniciales creados!');
  } else {
    console.log('[ℹ] Perfiles ya existen, seeding omitido');
  }
};
