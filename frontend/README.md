Java Installation (JDK 17)

This project requires Java 17. Newer versions (21+) may cause Gradle build issues.

Download JDK 17 (Temurin LTS):
https://adoptium.net/

After installation, set environment variables:

JAVA_HOME
C:\Program Files\Eclipse Adoptium\jdk-17.x.x
PATH
%JAVA_HOME%\bin

Verify installation:

java -version

Expected output:

openjdk version "17"
Android Studio & SDK Setup

Install Android Studio:
https://developer.android.com/studio

During installation ensure the following components are selected:

Android SDK
Android SDK Platform
Android SDK Platform-Tools
Android Emulator
Android SDK Environment Variables

Default SDK location:

C:\Users\<username>\AppData\Local\Android\Sdk

Set environment variables:

ANDROID_HOME
C:\Users\<username>\AppData\Local\Android\Sdk
PATH additions
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator

Verify installation:

adb version
Android Emulator Setup

In Android Studio:

Open Device Manager
Click Create Device
Select a device (e.g. Pixel 8)
Download a system image (x86_64 recommended)
Start the emulator

Verify running emulator:

adb devices

Expected output:

emulator-5554 device
Install Dependencies
npm install
Run the Project (Android)
npx expo run:android
Common Issues
adb is not recognized

Make sure platform-tools is added to PATH.

JAVA_HOME is not set

Ensure Java 17 is installed and JAVA_HOME points to it.

Emulator does not start

Start it manually from Android Studio → Device Manager.

Gradle build errors (IBM_SEMERU / JVM issues)

You are likely using an unsupported Java version. Use JDK 17.

Tips

Restart ADB if devices are not detected:

adb kill-server
adb start-server