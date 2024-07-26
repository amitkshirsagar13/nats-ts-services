const fs = require('fs');
const path = require('path');

const listPackages = (root, pkgs, packageFileIdentifiler = 'package.json') => {
    fs.readdirSync(root).filter(file => {
        const subPath = path.join(root, `${file}`);
        if(fs.lstatSync(subPath).isDirectory()){
            listPackages(subPath, pkgs, packageFileIdentifiler);
            const packageName = `${subPath}/${packageFileIdentifiler}`;
            if(fs.existsSync(packageName)) {
                const packageFile = fs.readFileSync(`${subPath}/package.json`);
                const packageInfo = JSON.parse(packageFile);
                pkgs.push({"path": subPath, "packageName": packageInfo.name, "version": packageInfo.version});
            }
        }
    });
}

module.exports = { listPackages };
