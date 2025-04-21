## 🚀 Getting Started

Welcome to Boracle-app! Follow these simple steps to get the app running on your local machine.

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App

1.  **Start the Expo development server:**
    ```bash
    npx expo start
    ```
    The app is running on development build for android only
    Connect to your phone to computer and choose run on android option. The apk file will automatically be installed on your phone
    There is apk file at .\android\app\build\outputs\apk\debug, you can save it to your phone and install the app

### Testing the app with device
    In [id].tsx, in  **connectToDevice** file, discover the characteristic for health information on device
    ```bash
    for (const service of services) {
                const chars = await device.characteristicsForService(service.uuid);
                // test sample uuid characteristic
                const char_str = '6e400003-b5a3-f393-e0a9-e50e24dcca9f' 
                for (const char of chars) {
                    if (char_str == char.uuid) setCharacteristic(char)
                }
                allCharacteristics[service.uuid] = chars;
            }
    ```
    You can check the characteristics of device through nRF Connect
