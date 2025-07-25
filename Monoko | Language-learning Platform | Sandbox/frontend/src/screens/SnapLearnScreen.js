import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Modal,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';
import { addScannedWord, addToWordBank } from '../store/store';

const { width, height } = Dimensions.get('window');

const SnapLearnScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { selectedLanguage } = useSelector(state => state.user);
  const { recentScans, wordBank } = useSelector(state => state.snapLearn);
  
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  // Mock AI analysis - in real app, this would call your AI service
  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results based on selected language
    const mockResults = {
      sw: {
        object: 'mti',
        translation: 'tree',
        pronunciation: 'MM-tee',
        confidence: 0.92,
        examples: [
          'Mti huu ni mkubwa - This tree is big',
          'Tunapanda miti - We are planting trees',
          'Kivuli cha mti - The shade of a tree'
        ],
        culturalNote: 'Trees hold special significance in East African culture, often serving as meeting places for community gatherings.',
        relatedWords: ['mzizi (roots)', 'majani (leaves)', 'matunda (fruits)']
      },
      ln: {
        object: 'nzete',
        translation: 'tree',
        pronunciation: 'nn-ZEH-teh',
        confidence: 0.89,
        examples: [
          'Nzete ya minene - A big tree',
          'Kolona nzete - To plant a tree',
          'Na nse ya nzete - Under the tree'
        ],
        culturalNote: 'In Congolese tradition, trees are often seen as symbols of life and community strength.',
        relatedWords: ['misisa (roots)', 'nkasa (leaves)', 'mbuma (fruits)']
      },
      am: {
        object: 'ዛፍ',
        translation: 'tree',
        pronunciation: 'zahf',
        confidence: 0.88,
        examples: [
          'ትልቅ ዛፍ - A big tree (tiliq zahf)',
          'ዛፍ መትከል - To plant a tree (zahf metikel)',
          'በዛፉ ጥላ ስር - Under the tree\'s shade (be-zafu tila sir)'
        ],
        culturalNote: 'The sycamore tree is sacred in Ethiopian Orthodox tradition and often found near churches.',
        relatedWords: ['ስር (sir - root)', 'ቅጠል (qitel - leaf)', 'ፍሬ (fire - fruit)']
      }
    };
    
    const result = mockResults[selectedLanguage] || mockResults.sw;
    result.imageUri = imageUri;
    result.timestamp = new Date().toISOString();
    result.id = Date.now().toString();
    
    setLastResult(result);
    dispatch(addScannedWord(result));
    setIsAnalyzing(false);
    
    return result;
  };

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        await analyzeImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        console.error('Camera error:', error);
      }
    }
  };

  const saveToWordBank = (word) => {
    dispatch(addToWordBank(word));
    Alert.alert('Saved!', `"${word.object}" has been added to your word bank.`);
  };

  const getLanguageName = () => {
    const names = { sw: 'Swahili', ln: 'Lingala', am: 'Amharic' };
    return names[selectedLanguage] || 'Swahili';
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-alt" size={64} color={colors.gray} />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-off" size={64} color={colors.error} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          Snap & Learn needs camera access to identify objects and teach you their names in {getLanguageName()}.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!lastResult ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
            onCameraReady={() => setCameraReady(true)}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>Snap & Learn</Text>
                <Text style={styles.instructionText}>
                  Point your camera at any object to learn its name in {getLanguageName()}
                </Text>
              </View>
              
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={[styles.captureButton, isAnalyzing && styles.capturingButton]}
                  onPress={takePicture}
                  disabled={isAnalyzing || !cameraReady}
                >
                  {isAnalyzing ? (
                    <View style={styles.analyzingContainer}>
                      <Icon name="psychology" size={32} color={colors.white} />
                      <Text style={styles.analyzingText}>Analyzing...</Text>
                    </View>
                  ) : (
                    <Icon name="camera-alt" size={32} color={colors.white} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => setLastResult(recentScans[0])}
                >
                  <Icon name="history" size={24} color={colors.white} />
                  <Text style={styles.historyButtonText}>Recent</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      ) : (
        <ScrollView style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setLastResult(null)}
            >
              <Icon name="arrow-back" size={24} color={colors.primary} />
              <Text style={styles.backButtonText}>Take Another</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveToWordBank(lastResult)}
            >
              <Icon name="bookmark-add" size={20} color={colors.white} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <Image source={{ uri: lastResult.imageUri }} style={styles.resultImage} />
          
          <View style={styles.resultContent}>
            <View style={styles.mainResult}>
              <Text style={styles.objectName}>{lastResult.object}</Text>
              <Text style={styles.translation}>= {lastResult.translation}</Text>
              <Text style={styles.pronunciation}>[{lastResult.pronunciation}]</Text>
              <View style={styles.confidenceContainer}>
                <Icon name="verified" size={16} color={colors.success} />
                <Text style={styles.confidence}>
                  {Math.round(lastResult.confidence * 100)}% confident
                </Text>
              </View>
            </View>
            
            <View style={styles.examplesSection}>
              <Text style={styles.sectionTitle}>Example Sentences</Text>
              {lastResult.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Icon name="format-quote" size={16} color={colors.primary} />
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.culturalSection}>
              <Text style={styles.sectionTitle}>Cultural Note</Text>
              <Text style={styles.culturalNote}>{lastResult.culturalNote}</Text>
            </View>
            
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Words</Text>
              <View style={styles.relatedWords}>
                {lastResult.relatedWords.map((word, index) => (
                  <View key={index} style={styles.relatedWordTag}>
                    <Text style={styles.relatedWordText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  permissionText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.md,
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  permissionButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  instructionTitle: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instructionText: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  scanFrame: {
    alignSelf: 'center',
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...shadows.large,
  },
  capturingButton: {
    backgroundColor: colors.warning,
  },
  analyzingContainer: {
    alignItems: 'center',
  },
  analyzingText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: 4,
  },
  historyButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  historyButtonText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: 4,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  resultImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  resultContent: {
    padding: spacing.lg,
  },
  mainResult: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  objectName: {
    fontSize: fonts.xxxl,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  translation: {
    fontSize: fonts.xl,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  pronunciation: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.gray,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  confidence: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.success,
  },
  examplesSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.md,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  exampleText: {
    flex: 1,
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  culturalSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  culturalNote: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  relatedSection: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  relatedWords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedWordTag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  relatedWordText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
});

export default SnapLearnScreen;
