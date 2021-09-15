# StudyFind Cloud Functions

<!-- # Firebase Functions Directory `./functions`

Last updated: Dec 7 2020

This folder contains cloud functions that will be deployed to firebase. It has its own `package.json`, and so should have its own `node_modules`, which should automatically be populated by running `npm install` in root directory.

Make sure `node_modules` exists before testing or emulating. Also note, any packages you need should be described in *this* `package.json` file, and not in the root file.

## Common Commands

These should be all run from the root folder

* Start firebase emulator: `npm run-script emulate`. Note it doesn't emulate cron functions
* Run tests: `npm test` or `npm t`
* Deploy functions to firebase: `firebase deploy --only functions` or `npx firebase deploy --only functions` if you don't want firebase tools polluting your namespace

## Structure Explained

* `index.js` exports the main firebase object containing the cloud functions.
* `src/` contains source for functions. Ideally, each file here is a cloud function or testing file
* `src/switch-func.js` is an important cloud http function because it is actually the ONLY http func currently allowed. It switches between all other http functions based on rest of the url. This is supposed to help keep the http section warm (prevent cold startup). All functions exposed by switch should be accessible from `http://<givenURL>/studies/<cloudFuncRef>`.
* `src/utils/switch-list.js` holds a list of all other (not switch) http functions, that the switch then chooses from. If you want to add a new http function, register it here, and not in `index.js`. It will be added through the switch.
* `src/firebase/` contains firebase functions. NOTE, these are not inlined because it is impossible to run tests without mocking them
* `src/utils/` contains other utility functions, such as generate-survey
* `__mocks__/` directories are present to hold mock files to ease testing -->
