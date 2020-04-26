const _ = require('lodash');
const faker = require('faker');
const flatten = require('flat');
const { program } = require('commander');

const fakerFlat = flatten(faker);

const stats = () => {
  const levels = 1;
  const results = {};
  _.each(_.keys(fakerFlat), fakerKey => {
    const key = fakerKey.split('.').slice(0, levels).join('.');

    if (_.has(results, key)) {
      results[key] += 1;
    } else {
      results[key] = 0;
    }
  });
  // console.log(results);
};

program
  .option('-d, --debug', 'output debugging information')
  .option('-n, --number <type>', 'specify number of items to generate')
  .option('-o, --output [file]', 'output to file instead of stdio');

program
  .command('list [category]')
  .description('list available types one level deep')
  .action((cmd, env) => {
    _.each(_.keys(fakerFlat), key => {
      if (!/^locales/.test(key)) {
        console.log(`  ${key}`);
      }
    });
  });

program
  .command('list-all <category>')
  .description('recursively list all available types, must supply category')
  .action((cmd, env) => {
    console.log('CMD', cmd, 'ENV', env);
  });

program.command('stats').description('show number of types by category');

program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ fakercli -n 25 address.streetAddress');
});

program.action((dir, cmdObj) => {
  const { number = 1 } = dir;
  const [type, ...rest] = cmdObj;
  if (_.has(fakerFlat, type)) {
    const fakerFunc = _.get(fakerFlat, type);
    _.times(number, () => {
      // spread command line array out if not an 'array' function
      if (_.isArray(rest) && rest.length > 1 && !/array/i.test(type)) {
        console.log(fakerFunc(...rest));
      } else if (!_.isEmpty(rest)) {
        console.log(fakerFunc(rest));
      } else {
        console.log(fakerFunc());
      }
    });
  } else {
    console.log(`No matching time found, here are close matches`);
    _.each(
      _.keys(fakerFlat).filter(flatKey => flatKey.includes(type) && !/locale/.test(flatKey)),
      key => {
        console.log(`  ${key}`);
      }
    );
  }
});

// console.log('PROGRAM', program);
module.exports = program;
