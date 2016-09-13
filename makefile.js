var npm_dir = './node_modules/.bin/';

jsmake.task('dependencies', function () {
    jsmake.utils.shell('npm install');
});

jsmake.task('docs', function () {
    jsmake.utils.rmdir('./public/docs');

    jsmake.utils.shell(npm_dir + 'apidoc -i src/ -o public/docs/');
});

jsmake.task('docs-win', function () {
    jsmake.utils.rmdir('./public/docs');

    jsmake.utils.shell(npm_dir.replace(/\//g, '\\') + 'apidoc -i src\\ -o public\\docs\\');
});

jsmake.task('default', function () {
    jsmake.utils.shell('sey rebuild');
});
