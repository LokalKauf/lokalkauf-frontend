export const environment = {
  production: true,
  firebase: {
    projectId: 'lokalkauf-271814',
    appId: '1:167060133004:web:86bdd7f131e56c9fb897a9',
    databaseURL: 'https://lokalkauf-271814.firebaseio.com',
    storageBucket: 'lokalkauf-271814.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyBPUxq7muZ6N09BQfoRpTpVZUceki0mmTo',
    authDomain: 'lokalkauf-271814.firebaseapp.com',
    messagingSenderId: '167060133004',
    measurementId: 'G-9DGG5K0BD3',
  },
  algolia: {
    appId: 'V051EVLWXE',
    searchKey: '85739eacae698fba1aaf524e40fe1b99',
    indexName: 'prod_TRADERS',
  },
  version: require('../../package.json').version,
};
