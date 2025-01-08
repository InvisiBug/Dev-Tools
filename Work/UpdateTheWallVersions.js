const fs = require('fs');
const path = require('path');

// Directory where the repo is located
const repoDir = '/Users/matthew.kavanagh/repos/tbd';

// Paths to specific package.json files
const packageJsonPaths = [
    path.join(repoDir, '/apps/bf/web/package.json'),
    path.join(repoDir, '/apps/bf/native/package.json'),
    path.join(repoDir, '/apps/sbg/web/package.json'),
    path.join(repoDir, '/apps/sbg/native/package.json'),
    path.join(repoDir, '/packages/bff-performance-tests/package.json'),
    path.join(repoDir, '/packages/tbd-page-objects/package.json'),
    path.join(repoDir, '/packages/tbd-shared/package.json')
];

// Function to update "@ppb/the-wall-web" version in specific package.json files
function updateTBDPackages(newVersions) {
    if (!newVersions) {
        console.error('Please provide a new version number. Usage: node tbd_package_update.js <new-version>');
        process.exit(1);
    }

    const updates = newVersions.split('\n\n');

    const formattedUpdates = updates.map((update) => {
        const [_, x, package, version] = update.split(' ');
        return [package, version]
    });

    // Function to update a specific package.json file
    const updatePackageJson = (filePath) => {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File not found - ${filePath}`);
            return;
        }

        try {
            // Update the package.json file with each package version change
            formattedUpdates.forEach(([package, version]) => {

            // Read and parse the package.json file
            const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Check and update @ppb/the-wall-web in dependencies or devDependencies only if the version has changed
            let updated = false;

            if (packageJson.dependencies && packageJson.dependencies[package] && packageJson.dependencies[package] !== version) {
                packageJson.dependencies[package] = version;
                updated = true;
            }
            if (packageJson.devDependencies && packageJson.devDependencies[package] && packageJson.devDependencies[package] !== version) {
                packageJson.devDependencies[package] = version;
                updated = true;
            }

            // If there was an update, write the file back
            if (updated) {
                fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8');
                console.log('\x1b[32m%s\x1b[0m', `Updated ${package} to version ${version} in ${filePath}`);
            }
            //  else {
            //     console.log(`No ${package} dependency found in ${filePath}`);
            // }
        })
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', `Error updating ${filePath}:`, error);
        }
    };

    // Update each package.json file from the list
    packageJsonPaths.forEach(updatePackageJson);
}

// Get the new version from the command line argument
const newVersion = process.argv[2];

// Run the update process
updateTBDPackages(newVersion);
