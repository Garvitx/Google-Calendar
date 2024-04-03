/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import './shim.js';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
