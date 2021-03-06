const optionDefinitions = [
  { name: 'list', alias: 'l', type: Boolean },
  { name: 'interactive', alias: 'i' },
  { name: 'number', alias: 'n', type: Number },
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  }
];

const sections = [
  {
    header: 'A typical app',
    content: 'Generates something {italic very} important.'
  },
  {
    header: 'Synopsis',
    content: [
      '$ example [{bold --timeout} {underline ms}] {bold --src} {underline file} ...',
      '$ example {bold --help}'
    ]
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Examples',
    content: 'A list of examples which demonstrate how to use the app.'
  },
  {
    content: [
      {
        desc: '1. A concise example. ',
        example: '$ example -t 100 lib/*.js'
      },
      {
        desc: '2. A long example. ',
        example: '$ example --timeout 100 --src lib/*.js'
      },
      {
        desc:
          '3. This even longer example will scan space for unknown things. Take care when scanning space, it could take some time. ',
        example:
          '$ example --src galaxy1.facts galaxy1.facts galaxy2.facts galaxy3.facts galaxy4.facts galaxy5.facts'
      }
    ]
  },
  {
    content: 'Project home: {underline https://github.com/me/example}'
  }
];
