# Android Build Guide

This guide provides the steps to build a signed Android APK for the RunesDAO+ project.

## 1. Project Setup

Due to issues with the original project structure, a new React Native project was created in the `RunesDAONew` directory. The source code and configuration files from the original project were copied into the new project.

## 2. Dependency Installation

The dependencies from the original `package.json` were merged into the new project's `package.json`. The versions of `react`, `react-native`, and `react-test-renderer` were downgraded to be compatible with the project's dependencies.

The dependencies were installed by running `npm install`.

## 3. Generate a Signing Key

A signing key was generated to sign the release build of the application.

1.  The following command was run in the `/home/sophiemabel69/RunesDAONew/android/app` directory:
    ```bash
    keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    ```
2.  The generated `my-release-key.keystore` file was moved to the `/home/sophiemabel69/RunesDAONew/android/app` directory.

## 4. Configure Gradle

The Gradle build was configured to use the signing key for release builds.

1.  The following lines were added to the `/home/sophiemabel69/RunesDAONew/android/gradle.properties` file. The passwords were added manually.
    ```properties
    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=your_password
    MYAPP_RELEASE_KEY_PASSWORD=your_password
    ```
2.  The `/home/sophiemabel69/RunesDAONew/android/app/build.gradle` file was modified to add a `release` signing configuration and to use it for the `release` build type.

## 5. Build the APK

To build the signed release APK, follow these steps:

1.  Navigate to the `/home/sophiemabel69/RunesDAONew/android` directory:
    ```bash
    cd /home/sophiemabel69/RunesDAONew/android
    ```
2.  Run the following command:
    ```bash
    ./gradlew assembleRelease
    ```
3.  After the build is successful, the APK file will be located at:
    `/home/sophiemabel69/RunesDAONew/android/app/build/outputs/apk/release/app-release.apk`
