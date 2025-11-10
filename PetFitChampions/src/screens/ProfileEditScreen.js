import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { getProfileData, saveProfileData } from '../utils/storage';

export default function ProfileEditScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    phoneNumber: '',
    photoURL: null,
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
    },
  });
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const data = await getProfileData();
    setProfileData(data);
  };

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const uri = result.assets[0].uri;
        setProfileData({ ...profileData, photoURL: uri });
        setHasChanges(true);
        showMessage('Photo selected!');
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const connectSocialMedia = (platform) => {
    Alert.prompt(
      `Connect ${platform}`,
      `Enter your ${platform} username:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (username) => {
            setProfileData({
              ...profileData,
              socialMedia: {
                ...profileData.socialMedia,
                [platform.toLowerCase()]: username || '',
              },
            });
            setHasChanges(true);
          },
        },
      ],
      'plain-text'
    );
  };

  const disconnectSocialMedia = (platform) => {
    setProfileData({
      ...profileData,
      socialMedia: {
        ...profileData.socialMedia,
        [platform.toLowerCase()]: '',
      },
    });
    setHasChanges(true);
  };

  const saveProfile = async () => {
    try {
      await saveProfileData(profileData);
      showMessage('Profile updated successfully!');
      setHasChanges(false);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Photo Upload */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.photoTouchable}>
          {profileData.photoURL ? (
            <Image
              source={{ uri: profileData.photoURL }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {user?.username?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <View style={styles.editPhotoBadge}>
            <Text style={styles.editPhotoIcon}>
              {uploading ? '⏳' : '📷'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Tap to change photo</Text>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username (Public)</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.username || ''}
            editable={false}
          />
          <Text style={styles.hint}>Username cannot be changed</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.displayName}
            onChangeText={(text) => {
              setProfileData({ ...profileData, displayName: text });
              setHasChanges(true);
            }}
            placeholder="Your full name"
            maxLength={50}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profileData.bio}
            onChangeText={(text) => {
              setProfileData({ ...profileData, bio: text });
              setHasChanges(true);
            }}
            placeholder="Tell others about yourself..."
            multiline
            numberOfLines={3}
            maxLength={150}
          />
          <Text style={styles.charCount}>
            {profileData.bio.length}/150
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email || ''}
            editable={false}
          />
          <Text style={styles.hint}>Email is managed in account settings</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <TextInput
            style={styles.input}
            value={profileData.phoneNumber}
            onChangeText={(text) => {
              setProfileData({ ...profileData, phoneNumber: text });
              setHasChanges(true);
            }}
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            maxLength={20}
          />
        </View>
      </View>

      {/* Social Media Connections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Media</Text>
        <Text style={styles.sectionSubtitle}>
          Connect your accounts to share achievements
        </Text>

        {/* Instagram */}
        <View style={styles.socialCard}>
          <View style={styles.socialInfo}>
            <Text style={styles.socialIcon}>📷</Text>
            <View style={styles.socialText}>
              <Text style={styles.socialName}>Instagram</Text>
              {profileData.socialMedia.instagram ? (
                <Text style={styles.socialUsername}>
                  @{profileData.socialMedia.instagram}
                </Text>
              ) : (
                <Text style={styles.socialDisconnected}>Not connected</Text>
              )}
            </View>
          </View>
          <View style={styles.socialActions}>
            {profileData.socialMedia.instagram ? (
              <TouchableOpacity
                style={styles.disconnectBtn}
                onPress={() => disconnectSocialMedia('Instagram')}
              >
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => connectSocialMedia('Instagram')}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Twitter */}
        <View style={styles.socialCard}>
          <View style={styles.socialInfo}>
            <Text style={styles.socialIcon}>🐦</Text>
            <View style={styles.socialText}>
              <Text style={styles.socialName}>Twitter</Text>
              {profileData.socialMedia.twitter ? (
                <Text style={styles.socialUsername}>
                  @{profileData.socialMedia.twitter}
                </Text>
              ) : (
                <Text style={styles.socialDisconnected}>Not connected</Text>
              )}
            </View>
          </View>
          <View style={styles.socialActions}>
            {profileData.socialMedia.twitter ? (
              <TouchableOpacity
                style={styles.disconnectBtn}
                onPress={() => disconnectSocialMedia('Twitter')}
              >
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => connectSocialMedia('Twitter')}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Facebook */}
        <View style={styles.socialCard}>
          <View style={styles.socialInfo}>
            <Text style={styles.socialIcon}>👤</Text>
            <View style={styles.socialText}>
              <Text style={styles.socialName}>Facebook</Text>
              {profileData.socialMedia.facebook ? (
                <Text style={styles.socialUsername}>
                  {profileData.socialMedia.facebook}
                </Text>
              ) : (
                <Text style={styles.socialDisconnected}>Not connected</Text>
              )}
            </View>
          </View>
          <View style={styles.socialActions}>
            {profileData.socialMedia.facebook ? (
              <TouchableOpacity
                style={styles.disconnectBtn}
                onPress={() => disconnectSocialMedia('Facebook')}
              >
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => connectSocialMedia('Facebook')}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
        onPress={saveProfile}
        disabled={!hasChanges}
      >
        <Text style={styles.saveBtnText}>
          {hasChanges ? 'Save Changes' : 'No Changes'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#32808D',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  photoTouchable: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5EB8C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#32808D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editPhotoIcon: {
    fontSize: 20,
  },
  photoHint: {
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#EEEEEE',
    color: '#999999',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  socialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  socialIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  socialText: {
    flex: 1,
  },
  socialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  socialUsername: {
    fontSize: 14,
    color: '#32808D',
    marginTop: 2,
  },
  socialDisconnected: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
  },
  socialActions: {
    flexDirection: 'row',
    gap: 8,
  },
  connectBtn: {
    backgroundColor: '#32808D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disconnectBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disconnectBtnText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#32808D',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#32808D',
  },
});
