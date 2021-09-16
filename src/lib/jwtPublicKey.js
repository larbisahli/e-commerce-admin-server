'use strict';
exports.__esModule = true;
var fs_1 = require('fs');
var path_1 = require('path');
var PublicKEY;
if (process.env.NODE_ENV === 'production') {
  var jwtRS256File = path_1['default'].join(process.cwd(), 'jwtRS256.key.pub');
  PublicKEY = fs_1['default'].readFileSync(jwtRS256File, 'utf8');
} else {
  PublicKEY = fs_1['default'].readFileSync(
    './src/config/jwtRS256.key.pub',
    'utf8'
  );
}
exports['default'] = PublicKEY;
