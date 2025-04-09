import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Button } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import React from 'react';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { uploadData, getUrl } from '@aws-amplify/storage';
// import { configure } from 'aws-amplify';


// configure({
//   Auth: {
//     identityPoolId: 'YOUR_COGNITO_IDENTITY_POOL_ID', // Required if using unauthenticated access
//     region: 'YOUR_REGION', // e.g. 'us-west-2'
//   },
//   Storage: {
//     bucket: 'YOUR_BUCKET_NAME', // Your S3 bucket name
//     region: 'YOUR_REGION',
//     level: 'public', // or 'private' if needed
//   }
// });

export default function HomeTab() {


  const colorTheme = useTheme();
  const { t } = useTranslation();

  // const uploadImageToS3 = async (file) => {
  //   if (!file) return;
  
  //   const fileName = `${Date.now()}-${file.name}`;
  
  //   try {
  //     const result = await uploadData({
  //       key: fileName,
  //       data: file,
  //       options: {
  //         contentType: file.type,
  //         accessLevel: 'public', // or 'private' if you want
  //         onProgress: (progress) => {
  //           console.log(`Uploaded: ${progress.transferredBytes}/${progress.totalBytes}`);
  //         },
  //       },
  //     }).result;
  
  //     console.log('Upload success:', result.key);
  
  //     const url = await getUrl({ key: result.key });
  //     console.log('File URL:', url.url);
  
  //     return url.url;
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  // const pickImage = async () => {
  //   const result = await launchImageLibrary({mediaType: 'photo'});
  //   if (result.didCancel) {
  //     console.log('User cancelled image picker');
  //   } else if (result.errorCode) {
  //     console.log('ImagePicker Error: ', result.errorMessage);
  //   } else {
  //     const asset = result.assets[0];
  //     uploadImageToS3(asset);
  //   }
  // };

  return (
    <View style={{ backgroundColor: colorTheme.background, flex: 1, padding: 20 }}>
      <Text style={styles.text}>{t('home_screen')}</Text>
      <Button title="Select and Upload Files" />

      {/* {uploadStatus.map((status, index) => (
        <Text key={index} style={{ marginTop: 10 }}>
          {status}
        </Text>
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
