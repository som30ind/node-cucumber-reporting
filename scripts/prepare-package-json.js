const { existsSync, writeFileSync } = require('fs');
const { join } = require('path');

const buildEsmDir = './dist/esm';

function createEsmModulePackageJson() {
  const packageJsonFile = join(buildEsmDir, '/package.json');

  if (existsSync(buildEsmDir) && !existsSync(packageJsonFile)) {
    writeFileSync(
      packageJsonFile,
      JSON.stringify({ type: 'module' }, null, 2),
    );
  }
}

createEsmModulePackageJson();
