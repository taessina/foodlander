#!/bin/bash
set -x
##dependencies
npm install -g react-native-git-upgrade
yarn add query-string
yarn add react
## NavigationExperimental deprecated in ver 0.44.0 onwards
## Use react-native 0.42 for react-native code push 1.17.4 version compatibility 
yarn add react-native
## Compatible to react-native 0.43
yarn add react-native-code-push
yarn add react-native-config
## The latest version of react-native-maps might has causes an error 20/10/17
yarn add react-native-maps
yarn add react-native-vector-icons
yarn add react-redux
yarn add redux
##Latest version got problems 
yarn add redux-logger
##Remember to correct the configureStore.js in src/stores/ change purgeAll() to purge() in line 20
yarn add redux-persist
yarn add redux-thunk
##New Navigation Method
yarn add react-navigation

##devDependencies
yarn add babel-eslint
yarn add eslint
yarn add eslint-config-airbnb
yarn add eslint-plugin-flow-vars
yarn add eslint-plugin-import
yarn add eslint-plugin-jsx-a11y
yarn add eslint-plugin-react
yarn add flow-bin

##Notes
###In android/app/src/main/java/com/taessina/foodlander/MainApplication.java, changed  protected boolean getUseDeveloperSupport() to public