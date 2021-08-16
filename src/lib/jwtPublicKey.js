import fs from 'fs';
import path from 'path';

let PublicKEY = null;

if (process.env.NODE_ENV === 'production') {
  const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key.pub');
  PublicKEY = fs.readFileSync(jwtRS256File, 'utf8');
} else {
  PublicKEY = fs.readFileSync('./src/config/jwtRS256.key.pub', 'utf8');
}

export default PublicKEY;
