import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

const LiveSessionsScreen = ({ navigation }) => {
  const { selectedLanguage } = useSelector(state => state.user);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock speakers data
  const mockSpeakers = [
    {
      id: 'speaker-001',
      name: 'Amara Kimani',
      languages: ['sw'],
      country: 'Kenya',
      city: 'Nairobi',
      rating: 4.8,
      sessionsCompleted: 156,
      hourlyRate: 15,
      bio: 'Native Swahili speaker with 3 years of teaching experience. I love sharing Kenyan culture and helping students feel confident speaking.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      availability: ['morning', 'evening'],
      specialties: ['Business Swahili', 'Cultural Context', 'Pronunciation'],
      nextAvailable: '2024-01-15 14:00',
      languages_taught: 'Swahili',
      flag: '🇰🇪'
    },
    {
      id: 'speaker-002',
      name: 'Joseph Mbeki',
      languages: ['ln'],
      country: 'Congo DRC',
      city: 'Kinshasa',
      rating: 4.9,
      sessionsCompleted: 89,
      hourlyRate: 12,
      bio: 'Passionate about Lingala and Congolese music. I help students learn through songs and cultural stories.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      availability: ['afternoon', 'evening'],
      specialties: ['Music & Culture', 'Conversational Lingala', 'Slang & Street Language'],
      nextAvailable: '2024-01-15 16:00',
      languages_taught: 'Lingala',
      flag: '🇨🇩'
    },
    {
      id: 'speaker-003',
      name: 'Hanan Tadesse',
      languages: ['am'],
      country: 'Ethiopia',
      city: 'Addis Ababa',
      rating: 4.7,
      sessionsCompleted: 203,
      hourlyRate: 18,
      bio: 'Ethiopian teacher with expertise in Amharic script and literature. Perfect for beginners and advanced learners.',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
      availability: ['morning', 'afternoon'],
      specialties: ['Fidel Script', 'Literature', 'Business Amharic', 'Religious Texts'],
      nextAvailable: '2024-01-16 10:00',
      languages_taught: 'Amharic',
      flag: '🇪🇹'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch speakers
    setTimeout(() => {
      const filteredSpeakers = selectedLanguage 
        ? mockSpeakers.filter(s => s.languages.includes(selectedLanguage))
        : mockSpeakers;
      setSpeakers(filteredSpeakers);
      setLoading(false);
    }, 1000);
  }, [selectedLanguage]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color={colors.warning} />);
    }
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half" size={16} color={colors.warning} />);
    }
    return stars;
  };

  const handleBookSession = (speaker) => {
    setSelectedSpeaker(speaker);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    setShowBookingModal(false);
    Alert.alert(
      'Session Booked!',
      `Your session with ${selectedSpeaker?.name} has been booked. You'll receive a confirmation email shortly.`,
      [{ text: 'OK', onPress: () => setSelectedSpeaker(null) }]
    );
  };

  const renderSpeakerCard = (speaker) => (
    <View key={speaker.id} style={styles.speakerCard}>
      <View style={styles.speakerHeader}>
        <Image source={{ uri: speaker.avatar }} style={styles.speakerAvatar} />
        <View style={styles.speakerInfo}>
          <View style={styles.speakerNameRow}>
            <Text style={styles.speakerName}>{speaker.name}</Text>
            <Text style={styles.speakerFlag}>{speaker.flag}</Text>
          </View>
          <Text style={styles.speakerLocation}>{speaker.city}, {speaker.country}</Text>
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              {renderStars(speaker.rating)}
            </View>
            <Text style={styles.rating}>{speaker.rating}</Text>
            <Text style={styles.sessionCount}>({speaker.sessionsCompleted} sessions)</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${speaker.hourlyRate}</Text>
          <Text style={styles.priceLabel}>per hour</Text>
        </View>
      </View>
      
      <Text style={styles.speakerBio}>{speaker.bio}</Text>
      
      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesLabel}>Specialties:</Text>
        <View style={styles.specialtiesList}>
          {speaker.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.availabilityRow}>
        <View style={styles.availabilityInfo}>
          <Icon name="schedule" size={16} color={colors.success} />
          <Text style={styles.availabilityText}>Next: {speaker.nextAvailable}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBookSession(speaker)}
          activeOpacity={0.8}
        >
          <Icon name="video-call" size={18} color={colors.white} />
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getLanguageName = () => {
    const names = { sw: 'Swahili', ln: 'Lingala', am: 'Amharic' };
    return names[selectedLanguage] || 'African languages';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="video-call" size={48} color={colors.secondary} />
        <Text style={styles.loadingText}>Finding {getLanguageName()} speakers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live with a Local</Text>
        <Text style={styles.headerSubtitle}>
          Practice {getLanguageName()} with native speakers
        </Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={colors.secondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Book 1-on-1 video sessions with verified native speakers. 
              Practice conversation, get corrections, and learn about culture firsthand.
            </Text>
          </View>
        </View>
        
        {speakers.length > 0 ? (
          speakers.map(renderSpeakerCard)
        ) : (
          <View style={styles.noSpeakersContainer}>
            <Icon name="person-search" size={48} color={colors.gray} />
            <Text style={styles.noSpeakersTitle}>No speakers available</Text>
            <Text style={styles.noSpeakersText}>
              We're working on finding more {getLanguageName()} speakers in your area.
            </Text>
          </View>
        )}
        
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Want to become a teacher?</Text>
          <Text style={styles.ctaText}>
            Are you a native speaker? Join our community of teachers and earn money 
            while sharing your language and culture.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Apply to Teach</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Session</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Icon name="close" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            
            {selectedSpeaker && (
              <View style={styles.modalBody}>
                <View style={styles.selectedSpeakerInfo}>
                  <Image source={{ uri: selectedSpeaker.avatar }} style={styles.modalAvatar} />
                  <View>
                    <Text style={styles.modalSpeakerName}>{selectedSpeaker.name}</Text>
                    <Text style={styles.modalSpeakerRate}>${selectedSpeaker.hourlyRate}/hour</Text>
                  </View>
                </View>
                
                <Text style={styles.bookingNote}>
                  Session duration: 60 minutes{'\n'}
                  Total cost: ${selectedSpeaker.hourlyRate}
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowBookingModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmBooking}
                  >
                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fonts.lg,
    fontFamily: fonts.medium,
    color: colors.gray,
    marginTop: spacing.md,
  },
  header: {
    backgroundColor: colors.secondary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    fontSize: fonts.xxl,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fonts.md,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  speakerCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  speakerHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  speakerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  speakerName: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
    marginRight: spacing.sm,
  },
  speakerFlag: {
    fontSize: 20,
  },
  speakerLocation: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  rating: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.warning,
  },
  sessionCount: {
    fontSize: fonts.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: fonts.xl,
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
  priceLabel: {
    fontSize: fonts.xs,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  speakerBio: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
    marginBottom: spacing.md,
  },
  specialtiesContainer: {
    marginBottom: spacing.md,
  },
  specialtiesLabel: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specialtyTag: {
    backgroundColor: colors.secondaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  specialtyText: {
    fontSize: fonts.xs,
    fontFamily: fonts.medium,
    color: colors.secondary,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  availabilityText: {
    fontSize: fonts.sm,
    fontFamily: fonts.medium,
    color: colors.success,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  bookButtonText: {
    fontSize: fonts.sm,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  noSpeakersContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  noSpeakersTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.gray,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noSpeakersText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  ctaCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  ctaTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  ctaText: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
    marginBottom: spacing.lg,
  },
  ctaButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ctaButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: fonts.lg,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  modalBody: {
    padding: spacing.lg,
  },
  selectedSpeakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  modalSpeakerName: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  modalSpeakerRate: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.secondary,
  },
  bookingNote: {
    fontSize: fonts.sm,
    fontFamily: fonts.regular,
    color: colors.gray,
    marginBottom: spacing.xl,
    lineHeight: fonts.lineHeights.relaxed * fonts.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  confirmButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.md,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default LiveSessionsScreen;
