const fs = require('fs');
const path = require('path');

try {
    const packageJsonPath = path.resolve(__dirname, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    const dependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
    const devDependencies = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];

    if (dependencies.length > 0) {
        const depCommand = `npm install ${dependencies.join(' ')}`;
        console.log("Command to install dependencies:");
        console.log(depCommand);
        console.log("\n"); // Add a newline for separation
    } else {
        console.log("No dependencies found.");
    }

    if (devDependencies.length > 0) {
        const devDepCommand = `npm install --save-dev ${devDependencies.join(' ')}`;
        console.log("Command to install devDependencies:");
        console.log(devDepCommand);
    } else {
        console.log("No devDependencies found.");
    }

} catch (error) {
    console.error("Error reading or parsing package.json:", error);
    process.exit(1);
}