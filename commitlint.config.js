module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding tests
        'chore', // Maintenance tasks
        'ci', // CI/CD changes
        'build', // Build system changes
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    // The preset also caps the whole header (type + scope + subject) at 100.
    'header-max-length': [2, 'always', 100],
  },
};
