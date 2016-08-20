var npm_dir = './node_modules/.bin/';

desc('Installs dependencies');
task('dependencies', function () {
    jake.exec('npm install', { printStdout: true }, function () {
        complete();
    });
});

desc('Generates documentation');
task('docs', function () {
    var commands = [
        'rm -rf ./public/docs',
        npm_dir + 'apidoc -i src/ -o public/docs/'
    ];

    jake.exec(commands, { printStdout: true }, function () {
        complete();
    });
});

desc('Generates documentation in Windows');
task('docs-win', function () {
    var commands = [
        'del /s /q .\\public\\docs',
        npm_dir.replace(/\//g, '\\') + 'apidoc -i src\\ -o public\\docs\\'
    ];

    jake.exec(commands, { printStdout: true }, function () {
        complete();
    });
});

desc('Compiles the source');
task('default', function () {
    jake.exec('sey rebuild', { printStdout: true }, function () {
        complete();
    });
});
