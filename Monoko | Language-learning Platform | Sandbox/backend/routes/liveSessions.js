const express = require('express');
const router = express.Router();

// Sample native speakers data
const nativeSpeakers = [
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
    specialties: ['Business Swahili', 'Cultural Context', 'Pronunciation']
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
    specialties: ['Music & Culture', 'Conversational Lingala', 'Slang & Street Language']
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
    specialties: ['Fidel Script', 'Literature', 'Business Amharic', 'Religious Texts']
  }
];

// GET /api/live-sessions/speakers - Get available native speakers
router.get('/speakers', (req, res) => {
  try {
    const { language, availability, maxRate } = req.query;
    
    let filteredSpeakers = nativeSpeakers;
    
    if (language) {
      filteredSpeakers = filteredSpeakers.filter(speaker => 
        speaker.languages.includes(language)
      );
    }
    
    if (availability) {
      filteredSpeakers = filteredSpeakers.filter(speaker => 
        speaker.availability.includes(availability)
      );
    }
    
    if (maxRate) {
      filteredSpeakers = filteredSpeakers.filter(speaker => 
        speaker.hourlyRate <= parseInt(maxRate)
      );
    }
    
    res.json({
      success: true,
      data: filteredSpeakers,
      count: filteredSpeakers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch speakers',
      message: error.message
    });
  }
});

// GET /api/live-sessions/speakers/:id - Get specific speaker details
router.get('/speakers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const speaker = nativeSpeakers.find(s => s.id === id);
    
    if (!speaker) {
      return res.status(404).json({
        success: false,
        error: 'Speaker not found'
      });
    }
    
    res.json({
      success: true,
      data: speaker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch speaker details',
      message: error.message
    });
  }
});

// POST /api/live-sessions/book - Book a session with a native speaker
router.post('/book', (req, res) => {
  try {
    const { speakerId, date, time, duration, topics } = req.body;
    
    // TODO: Implement actual booking logic with calendar integration
    const sessionId = `session-${Date.now()}`;
    
    res.json({
      success: true,
      data: {
        sessionId,
        speakerId,
        date,
        time,
        duration,
        topics,
        status: 'confirmed',
        meetingUrl: `https://meet.monoko.app/session/${sessionId}`,
        message: 'Session booked successfully! You will receive a confirmation email shortly.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to book session',
      message: error.message
    });
  }
});

// GET /api/live-sessions/my-sessions - Get user's booked sessions
router.get('/my-sessions', (req, res) => {
  try {
    // TODO: Get from database based on user ID
    const userSessions = [
      {
        id: 'session-123',
        speakerName: 'Amara Kimani',
        language: 'Swahili',
        date: '2024-01-15',
        time: '14:00',
        duration: 60,
        status: 'upcoming',
        meetingUrl: 'https://meet.monoko.app/session/session-123'
      }
    ];
    
    res.json({
      success: true,
      data: userSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
      message: error.message
    });
  }
});

module.exports = router;
