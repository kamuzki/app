import { StatusBar } from 'expo-status-bar'; // Corrected import
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
  export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [watermarkText, setWatermarkText] = useState('');
    const [photoUri, setPhotoUri] = useState(null);
    const [photoNumber, setPhotoNumber] = useState(1);
    const cameraRef = useRef(null);

    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const capturePhoto = async () => {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        const manipulatedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              draw: {
                text: `${photoNumber}`,
                fontSize: 20,
                color: 'white',
                x: 10,
                y: 10,
              },
            },
            {
              draw: {
                text: watermarkText,
                fontSize: 20,
                color: 'white',
                x: 300, // Adjust x as needed
                y: 10,
              },
            },
            {
              draw: {
                text: dateTimeString,
                fontSize: 20,
                color: 'white',
                x: 10,
                y: 400, // Adjust y as needed
              },
            },
          ],
          { compress: 0.5 }
        );
        setPhotoUri(manipulatedPhoto.uri);
        setPhotoNumber(photoNumber + 1);
      }
    };

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#333333']} // Example gradient colors
          style={styles.gradient}
        >
          {!photoUri && (
            <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter watermark text"
                  value={watermarkText}
                  onChangeText={setWatermarkText}
                />
                <Ionicons
                  name="camera-outline"
                  size={80}
                  color="white"
                  onPress={capturePhoto}
                  style={styles.captureButton}
                />
              </View>
            </Camera>
          )}
          {photoUri && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <Button title="Take another photo" onPress={() => setPhotoUri(null)} />
            </View>
          )}
          <StatusBar style="auto" />
        </LinearGradient>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    gradient: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      color: 'white',
    },
    captureButton: {
      marginLeft: 20,
    },
    photoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    photo: {
      width: 300,
      height: 400,
      resizeMode: 'contain',
    },
  });
