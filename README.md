### React Native - Mapbox
A simple React Native app that integrates with Mapbox SDK and allows the user to input
- Source
- Destination
- Mode of Transport

It then displays the following,
- Optimal route between source & destination
- Distance (kms)
- Time taken for travel (Day/Hr/Min)
- Turn by Turn Instructions to travel from source to destination

#### Features:-
- React Native Project (Created by ```react-native init```)
- Supports Android as of now
- Uses **Mapbox Geocoding API** to get the Coordinates of the places
- **Mapbox Directions API** is used to  get the optimal Route between the places, along with Distance and Duration
- Appropriate error messages are displayed to guide the User in entering the correct details

#### Pre-requisite:

Mapbox API token - Find instructions to get one [here](https://www.mapbox.com/help/how-access-tokens-work/)


#### Set up development environment
Follow the steps as mentioned in **Getting Started** section of react-native website in the **Build with native code** tab


#### Clone Repository and Running on device/emulator

- git clone ```https://github.com/padmasaravan/ReactNative_MapBox.git```
- ```cd ReactNative_Mapbox```
- ```npm install``` (to install project dependencies)
- In the file ```utils.js```, change the value of the constant ```mapboxAccessToken``` to your token value (optional)
- Launch the Android Virtual Device (AVD) in the Emulator .If you are using Physical Device, connect it the PC.
- Execute the command, ```react-native run-android```
- To change or modify the app, start editing from ```index.js``` file ( the entry point of React Native applications)
