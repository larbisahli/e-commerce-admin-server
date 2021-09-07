import Analytics from './analytics';
import Login from './login';
import Upload from './upload';
import Backup from './backup';
import { Application } from 'express';

const MountRoutes = (app: Application): void => {
  app.use('/api/analytics', Analytics);
  app.use('/api/login', Login);
  app.use('/api/upload', Upload);
  app.use('/api/24dcd40ac110482/backup', Backup);
};

export default MountRoutes;
