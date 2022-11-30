#!/usr/bin/env node

//Dependendices
import fetch from 'node-fetch';
import minimist from 'minimist';
import moment from 'moment-timezone';
import { exit } from 'process';

//const fs = require("fs");
//const timezone = moment.tz.guest();
// Require minimist module (make sure you install this one via npm).
const args = minimist(process.argv.slice(2));
//console.log(args);

//default action
if( args.h ) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
  -h            Show this help message and exit.
  -n, -s        Latitude: N positive; S negative.
  -e, -w        Longitude: E positive; W negative.
  -z            Time zone: uses tz.guess() from moment-timezone by default.
  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
  -j            Echo pretty JSON from open-meteo API and exit.`)
  exit(0);
}
//default coordinates unless specified
var latitude = 35.92;
if (args.n) {
    latitude = args.n;
}
if (args.s) {
    latitude  = args.s * -1;
}

var longitude = -79.05;
if (args.e) {
    longitude = args.e;
}
if (args.w) {
    longitude = args.w * -1;
}

var timezone = moment.tz.guess();
if (args.z) {
    timezone = args.z;
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);

const data = await response.json();

if( args.j ){
    console.log(data);
    exit(0);
}

var days = 1;

if (args.d != null) {
    days = args.d;
}

if (data.daily.precipitation_hours[days] != 0) {
    console.log('You might need your galoshes');
} else {
    console.log('You will not need your galoshes');
}

if (days == 0) {
    console.log("today.")
  } else if (days > 1) {
    console.log("in " + days + " days.")
  } else {
    console.log("tomorrow.")
  }

exit(0);

