import Analytics from './analytics';
import Login from './login';
import Upload from './upload';
import Backup from './backup';
import { Express } from 'express';

const MountRoutes: (app: Express) => void = (app) => {
  app.use('/api/analytics', Analytics);
  app.use('/api/login', Login);
  app.use('/api/upload', Upload);
  app.use('/api/24dcd40ac110482/backup', Backup);
};

export default MountRoutes;
