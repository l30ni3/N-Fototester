# Project Title

N-Fototester

## Description

A photo-based measurement method for determining a leaf green value and then a mobile prototype for the application of this method is developed, using RGB image data. During a measurement, the plant part of the image is isolated and an average color value is returned, using PlantCV. The program takes into account external influences such as different exposure situations or backgrounds.

This mobile prototype is developed on the basis of user requirements in crop cultivation and is meant to be a comparable and easier-to-use alternative to the N-tester.

## Getting Started

Download the project and open up the terminal to navigate to the project root.
As this has only been tested on iOS devices, the following instructions are only for iOS.

### Dependencies

* install npm as package manager
* run npm install to get all dependencies

### Run on iOS simulator

* First install the iOS pods. This will create an Xcode workspace and compiles the code for iOS

```
cd ios
pod install
```


* Now start the Metro server (JavaScript bundler for React Native)

```
cd ../
npm start
```
* To run flask in the backend, navigate to /api to start the built in server. It will run per default on localhost

```
cd api
flask run
```

* Run the app on an iOS simulator

```
cd ../
npm run ios
```

### Run on physical iOS device

* First install the iOS pods. This will create an Xcode workspace and compiles the code for iOS

```
cd ios
pod install
```

* To run the application on a real device some adjustments need to be done to the network config first. First go to /ios/Fototester/Info.plist and in line 31 under NSExceptionDomains insert your network IP to allow connections to and from this network.
```
<key>192.168.x.x/</key>

```
* Also replace your network IP in /screens/components/constants.js. in line 2. Leave the :5000, as the flask services will run on this port. 
```
  SERVER_URL: 'http://192.168.x.x:5000',

```

* Now proceed as written above with a simulator. Start the Metro server (JavaScript bundler for React Native)

```
cd ../
npm start
```
* To run flask in the backend, navigate to /api to start the built in server. To run on a physical device, the server should not be running on localhost, but on a local network. The IP address is added as flag to the command. Therefore both devices (PC and connected mobile device) need to be on the same network.

```
cd api
flask run —host=xxx.xxx.x.x
```

* Next connect the iOS device to your computer and open up the Xcode workspace under /ios/Fototester.xcworkspace in Xcode. Find your device in the list of connected devices and click on the Run Button in the top right corner to build and run the app.
