import React, {useEffect, useState} from 'react';
import {Avatar} from 'react-native-paper';
import {Image, TouchableOpacity, View} from 'react-native';
import ImgToBase64 from 'react-native-base64';

import {componentsStyles} from '../../settings/GlobalStyle';
import {SelectCameraOC} from '../select-camera-oc/SelectCameraOC';

function AvatarAroundIconOC(props: {
                              icon: string,

                              style?: any
                              size?: number
                              color?: string,
                            }
) {

  return (
    <Avatar.Icon
      color={props.color}
      icon={props.icon}
      size={props.size}
      style={props.style}
    />
  );
}

function AvatarAroundImageOC(props: {
                               selectImage: boolean,
                               style?: any
                               size?: number,
                               path?: Image,
                               imageBase64?: string,
                               selectTitle?: string,
                               onLoading?: ((loading: boolean) => void)
                               onChange?: ((base64: string | null) => void),
                             }
) {

  const [image, setImage] = useState<any>(props.imageBase64);

  async function convert(path: string) {
    if (path) {
      props.onLoading ? props.onLoading(true) : false;
      const base64String = ImgToBase64.encode(path);
      setImage(base64String);
      props.onChange ? props.onChange(base64String) : false;
      props.onLoading ? props.onLoading(false) : false;
    } else {
      setImage(null);
      props.onChange ? props.onChange(null) : false;
    }
  }

  useEffect(() => {
    setImage(props.imageBase64);
  }, [props.imageBase64]);


  return (
    <View>
      {
        props.selectImage ?
          <TouchableOpacity
            onPress={() => {
              SelectCameraOC(props.selectTitle ? props.selectTitle : '', (path) => {
                convert(path).then();
              })
            }}
          >
            <Avatar.Image
              size={props.size}
              source={props.path ? props.path : image ? {uri: `data:image/gif;base64,${image}`} : require('@/assets/avatar.jpg')}
              style={props.style}
            />
          </TouchableOpacity>
          :
          <TouchableOpacity>

            <Avatar.Image
              size={props.size}
              source={props.path ? props.path : image ? {uri: `data:image/gif;base64,${image}`} : require('@/assets/avatar.jpg')}
              style={props.style}
            />
          </TouchableOpacity>
      }
    </View>
  );
}

function AvatarAroundTextOC(props: {
                              path: string,

                              size?: number
                              color?: string,
                              style?: any
                            }
) {

  return (
    <Avatar.Text
      color={props.color}
      label={props.path}
      size={props.size}
      style={props.style ? props.style : componentsStyles.container}
    />

  );
}

export {AvatarAroundIconOC, AvatarAroundImageOC, AvatarAroundTextOC};
