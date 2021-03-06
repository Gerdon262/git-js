const {folderExists} = require('./lib/utils');
const Git = require('./git');

const api = Object.create(null);
for (let imported = require('./lib/api'), keys = Object.keys(imported), i = 0; i < keys.length; i++) {
   const name = keys[i];
   if (/^[A-Z]/.test(name)) {
      api[name] = imported[name];
   }
}

/**
 * Adds the necessary properties to the supplied object to enable it for use as
 * the default export of a module.
 *
 * Eg: `module.exports = esModuleFactory({ something () {} })`
 */
module.exports.esModuleFactory = function esModuleFactory(defaultExport) {
   return Object.defineProperties(defaultExport, {
      __esModule: { value: true },
      default: { value: defaultExport },
   });
}

module.exports.gitExportFactory = function gitExportFactory (factory, extra) {
   return Object.assign(function () {
         return factory.apply(null, arguments);
      },
      api,
      extra || {},
   );
};

module.exports.gitInstanceFactory = function gitInstanceFactory (baseDir) {

   if (baseDir && !folderExists(baseDir)) {
      throw new Error("Cannot use simple-git on a directory that does not exist.");
   }

   return new Git(baseDir || process.cwd());
};
