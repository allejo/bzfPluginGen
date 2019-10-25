module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules/',

        // Skip any files starting with a lowercase letter
        '__tests__/[a-z].*.ts',

        // Skip the dist/ folder
        'dist/',
    ],
};
