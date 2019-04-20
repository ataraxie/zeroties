# Zeroties - No more ties!

Zeroties finally brings platform-independence to our highly acclaimed [Successorships](https://github.com/ataraxie/successorships) framework! And now makes what was SLOOOOW before HYPERFAST!

## Requirements

* Recent version of [NPM](https://www.npmjs.com/)
* Google Chrome or Mozilla Firefox

## Setup

* Install the dependencies of the Zeroties daemon
  * cd into `./zeroties-app`
  * Run `npm install`
* Install the browser addon
  * (We are currently still in development stage, so developer mode is required)
  * Chrome:
    * Open URL `chrome://extensions` in Chrome
    * Click `Load unpacked extension`
    * Open directory `./zeroties-browser-addon`
  * Firefox:
    * Open URL `about:debugging` in Firefox
    * Click `Load Temporary Add-on`
    * Select any file in the `./zeroties-browser-addon` directory
    * (Note that on Firefox dev addons need to be installed again after each restart)

## Run an example

* Run the Zeroties daemon
  * cd into `./zeroties-app`
  * Run `npm start`
* Run any example
  * cd into `./zeroties-example/%EXAMPLE%`
  * Run `npm start`
* In Chrome or Firefox
  * Go to http://localhost:3000 (yes it's hardcoded, hope you got 3000 free!)
  * This will open a webapp that advertises a Zeroties service
  * Open the Zeroties menu by clicking on the Z button at the top right
  * At least one entry should appear in the list
    * If the popup doesn't work for some reason, just use the link displayed in the app
  * Open the URL as many times as you want
    * These will become clients
  * Kill the tab in which you opened localhost:3000
  * The clients will be disconnected an recover after a short time (approx. 1.5 sec => see eval, hehehe)