const gulp = require('gulp');
const gutil = require('gulp-util');
const pack = require('./scripts/pack');
const { exec } = require('child_process')

const processGulpModuleTask = async (gulpModule, tasks) => {
    process.chdir(gulpModule.path);
    console.log(`gulping module ${gulpModule.packageName}`)
    const taskProcess = new Promise(async (resolve, reject) => {
        exec(tasks, function (err, stdout, stderr) {
            console.log(stdout);
        });
    });
    taskProcess.then(() => {
        console.log(`Finished gulping module ${gulpModule.packageName}`);
    })
}

const runGulpTask = async (tasks) => {
    console.log('Gulping task in modules!!!');
    const gulpTargets = [];
    const basePath = __dirname;
    pack.listPackages('src/pkgs', gulpTargets, 'gulpfile.js');
    console.log(`Running from ${basePath}!!!`);
    for await (const gulpModule of gulpTargets) {
        for await (const taskItem of tasks) {
            process.chdir(basePath);
            processGulpModuleTask(gulpModule, `gulp ${taskItem}`);
        }
    }
    process.chdir(basePath);
}

const build = (done) => {
    runGulpTask('build');
    done();
}

const clean = (done) => {
    runGulpTask('clean-dist');
    done();
}

const prepareTestPackage = async (done) => {
    await runGulpTask(['prepareTestPackage'])
    done();
}



gulp.task('build', build);
gulp.task('clean-dist', clean);
gulp.task('prepareTestPackage', prepareTestPackage);


gulp.task('watch', (done) => {
    gulp.watch(['src/**/*.*', '!src/**/dist/**/*.*'], gulp.series('clean-dist', 'build', 'prepareTestPackage'))
    .on('change', (itemPath, stats) => {
        gutil.log(gutil.colors.blue(`change [${stats.size}] ${itemPath}`));
    });
    done();
});

gulp.task('default', gulp.series('clean-dist', 'build', 'prepareTestPackage'));
