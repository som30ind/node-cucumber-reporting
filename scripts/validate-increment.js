const { exec } = require('child_process');
const { compare: compareVersions } = require('semver');

// Specify the package name and version from package.json
const { version: packageVersion, name: packageName } = require('../package.json');

// Function to execute the npm show command to get the latest version from npmjs.com
function getLatestVersionFromNpm(packageName) {
  return new Promise((resolve, reject) => {
    exec(`npm show ${packageName} version`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Compare the versions and check if the version in package.json is incremented
async function checkVersionIncrement() {
  try {
    const latestVersion = await getLatestVersionFromNpm(packageName);
    console.log('Latest version from npmjs.com:', latestVersion);

    if (latestVersion && packageVersion) {
      if (compareVersions(packageVersion, latestVersion) === -1) {
        console.log('The version in package.json is incremented.');
      } else {
        console.log('The version in package.json is not incremented.');
        throw new Error('package.json is not incremented with latest version.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Call the function to check version increment
checkVersionIncrement();
