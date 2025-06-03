import React from 'react';
import {launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions} from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';
import * as ImageManipulator from 'expo-image-manipulator';

import manipuladorExcecoes from '../../services/ManipuladorExcecoes';

const SelectCameraOC = (title: string, onPress: (path: string) => void) => {
  // Prompt user to choose between camera or gallery
  // For demonstration, let's use launchImageLibrary; you can add a UI to let the user choose
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    selectionLimit: 1,
  };

  launchImageLibrary(options, async (response) => {
    if (response.didCancel) {
      // User cancelled the picker
      return;
    }
    if (response.errorCode) {
      manipuladorExcecoes.exib('Ocorreu um erro ao carregar a imagem.');
      return;
    }
    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      const uri = asset.uri;
      const rotation = 0; // Default rotation, as originalRotation is not available

      if (uri) {
        try {
          const resized = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024, height: 768 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          onPress(resized.uri);
        } catch (err) {
          manipuladorExcecoes.req(err);
        }
      }
    }
      //   ImageResizer.createResizedImage(uri, 1024, 768, "JPEG", 80, rotation)
      //     .then(({ uri: resizedUri }: { uri: string }) => {
      //       onPress(resizedUri);
      //     })
      //     .catch((err: unknown) => {
      //       manipuladorExcecoes.req(err);
      //     });
      // }
    
  });
};

export {SelectCameraOC}

