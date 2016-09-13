var npm_dir = './node_modules/.bin/';

jsmake.task('dependencies', function () {
    jsmake.utils.shell('npm install');
});

jsmake.task('docs', function () {
    var commands = [
        'rm -rf ./public/docs',
        npm_dir + 'apidoc -i src/ -o public/docs/'
    ];

    jsmake.utils.shell(commands);
});

jsmake.task('docs-win', function () {
    var commands = [
        'del /s /q .\\public\\docs',
        npm_dir.replace(/\//g, '\\') + 'apidoc -i src\\ -o public\\docs\\'
    ];

    jsmake.utils.shell(commands);
});

jsmake.task('default', function () {
    jsmake.utils.shell('sey rebuild');
});
