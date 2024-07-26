const argv = require("./parseArguments");
const fs = require('fs');

const PKGS = argv('pkgs');
const base = argv('base');

const pkgNames = PKGS.split('|');

const updateVersion = (pkg, base) => {
    const PKG_FILE_NAME = base === 'n' ? `src/pkgs/@amitkshirsagar13/${pkg}/package.json` : 'package.json'
    if(fs.existsSync(PKG_FILE_NAME)) {
        const PKG = require(`../${PKG_FILE_NAME}`);

        const INCREMENT_CFG = require('./increment.json')

        const INCREMENT = INCREMENT_CFG.find((segment) => segment.increment).name;

        const VERSION = PKG.version;

        const pattern = /^(\d+)(\.{1})(\d+)(\.{1})(\d+)$/;

        const versionExtract = pattern.exec(VERSION);
        const ver = {
            major: parseInt(versionExtract[1]),
            minor: parseInt(versionExtract[3]),
            patch: parseInt(versionExtract[5]),
            version: function () {
                return `${this.major}.${this.minor}.${this.patch}`
            }
        }

        switch (INCREMENT) {
            case 'MAJOR':
                ver.major++;
                break;
            case 'MINOR':
                ver.minor++;
                break;
            case 'PATCH':
                ver.patch++;
                break;
            default:
                console.log('No version incremented!!!')
        }

        const newVersion = ver.version.apply(ver);

        console.log(`Upgraded version ${VERSION} -> ${newVersion}`);

        PKG.version= newVersion;

        fs.writeFile(`./${PKG_FILE_NAME}`, JSON.stringify(PKG, null, '\t'), function writeJSON(err) {
            if (err) {
                return console.log(err);
            }
            console.log(JSON.stringify(PKG));
            console.log(`Writing new version to ${PKG_FILE_NAME}`);
        });
    } else {
        console.log('No package file found:', PKG_FILE_NAME)
    }

}

if (base === 'n') {
    pkgNames.forEach((pkg) => {
        updateVersion(pkg, base);
    });
} else {
    updateVersion(undefined, base);
}
