module.exports = {
    "roots": [
        "<rootDir>/test"
    ],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "transform": {
        "^.+\\.tsx?$": ["ts-jest", { "diagnostics": false }]
    },
    "collectCoverage": true,
    "coverageReporters": ["json", "lcov", "text", "clover"],
    "verbose": true,
    "moduleNameMapper": {
        "vscode": "<rootDir>/__mocks__/vscode.js",
        "uuid": "<rootDir>/__mocks__/uuid.js"
    }
}
