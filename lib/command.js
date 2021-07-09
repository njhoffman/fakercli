const _ = require('lodash');
const faker = require('faker');
const flatten = require('flat');
const { program } = require('commander');
const chalk = require('chalk');

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

const outputFaker = (func, { number, args, type }) => {
  _.times(number, () => {
    // spread command line array out if not an 'array' function
    if (_.isArray(args) && args.length > 1 && !/array/i.test(type)) {
      console.log(func(...args));
    } else if (!_.isEmpty(args)) {
      console.log(func(args));
    } else {
      console.log(func());
    }
  });
};

const outputMatches = (type, matches) => {
  if (matches.length > 0) {
    console.log(
      `\n${chalk.hex('#abc')(
        ` No matching time found for ${type}, here are ${_.keys(matches).length} close matches`
      )}`
    );
    _.each(matches.sort(), key => {
      console.log(`  ${chalk.hex('#6bb')(key)}`);
    });
  } else {
    const allKeys = _.reject(_.keys(fakerFlat), flatKey => /locale/.test(flatKey));
    console.log(`\nNo matches found, here are all ${allKeys.length} options...`);

    _.each(allKeys.sort(), key => {
      console.log(`  ${chalk.hex('#6bb')(key)}`);
    });
  }
};

program.action((options, cmdObj = []) => {
  const { number = 1 } = options;
  const [type, ...rest] = cmdObj.args;

  const typeMatches = [];
  _.chain(fakerFlat)
    .keys()
    .some(flatKey => {
      if (flatKey === type) {
        typeMatches.push(flatKey);
        return true;
      } else if (flatKey.includes(type) && !/locale/.test(flatKey)) {
        typeMatches.push(flatKey);
      }
      return false;
    })
    .value();

  if (typeMatches.length === 1 && typeMatches[0] === type) {
    const fakerFunc = _.get(fakerFlat, typeMatches[0]);
    outputFaker(fakerFunc, { number, args: rest, type });
  } else {
    outputMatches(type, typeMatches);
  }
});

// console.log('PROGRAM', program);
module.exports = program;
