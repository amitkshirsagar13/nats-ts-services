const fs = require('fs');
const path = require('path');
// const packlist = require('npm-packlist')
const tar = require('tar')

const srcModules = 'src/pkgs'

const packages = [];

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

// const filterPackages = async () => {
//     await listPackages(srcModules, packages);
//     console.log(packages);
//     packages.forEach(pkg => {
//         const packageTarball = `out/${pkg.packageName}-${pkg.version}.tgz`
//         console.log(packageTarball);
//         packlist({ path: pkg.path })
//             .then(files => tar.create({
//             prefix: 'package/',
//             cwd: pkg.path,
//             file: packageTarball,
//             gzip: true
//             }, files))
//             .then(_ => {
//                 console.log(`Created ${pkg.packageName}-${pkg.version}`);
//             })
//     })
// }

// filterPackages();

module.exports = { listPackages };
