const { resolve } = require('path');
const { moveSync } = require('fs-extra');

const { version: packageVersion, name: packageName } = require('../package.json');
const tgzFileName = packageName.replace(/[\@]/g, '').replace(/[\/]/g, '-');

const tgzName = `${tgzFileName}-${packageVersion}.tgz`;
const tgzNameInDemo = `${tgzFileName}.tgz`;
const srcTgz = resolve(tgzName);
const demoTgz = resolve('demo/lib', tgzNameInDemo);
moveSync(srcTgz, demoTgz);
console.log(`TGZ: Moved from ${srcTgz} to ${demoTgz}`);
