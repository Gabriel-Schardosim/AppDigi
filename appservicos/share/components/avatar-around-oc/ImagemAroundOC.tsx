import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-paper';
import { Modal, Portal, Button } from 'react-native-paper';
import {Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import ImgToBase64 from 'react-native-base64';
import {SelectCameraOC} from '../select-camera-oc/SelectCameraOC';

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

  async function convert(path: string | undefined) {
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

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);  

  var base64Icon = `data:image/gif;base64,${image}`

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
            <Card.Cover
              source={
                props.path
                  ? (typeof props.path === 'number' ? props.path : undefined)
                  : image
                  ? { uri: `data:image/gif;base64,${image}` }
                  : { uri: `http://protocolo.digifred.net.br:8080/assets/imagens/semimagem.gif` }
              }
              style={props.style}
            />
          </TouchableOpacity>
          :
          <View style={{flex: 1}}>
            <View>
              <TouchableOpacity onPress={showModal}
                style={{flex: 1}}>
                  <Card.Cover
                    resizeMode='cover'
                    source={
                      props.path
                        ? (typeof props.path === 'number' ? props.path : undefined)
                        : image
                        ? { uri: `data:image/gif;base64,${image}` }
                        : { uri: `http://protocolo.digifred.net.br:8080/assets/imagens/semimagem.gif` }
                    }
                    style={props.style}
                  />
              </TouchableOpacity>
            </View>
            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                <Image resizeMode = 'contain' style={styles.bakcgroundImage} source={{uri: base64Icon}}/>
                <Button mode="contained" style={styles.buttom} onPress={hideModal}>
                  Fechar
                </Button>
              </Modal>
            </Portal>
          </View>
      }
    </View>
  );
}

export {AvatarAroundImageOC};

const styles = StyleSheet.create({
  view: {
    margin: 15,
  },
  bakcgroundImage: {
      flex: 1, 
      alignSelf: 'stretch',
  },
  containerStyle: {
    backgroundColor: 'white',     
    width: '100%',
    height: '100%'
  },
  buttom: {
    margin: 10
  }
});
