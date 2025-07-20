# Contributing to Monoko

Welcome to Monoko! We're excited to have you contribute to making African language learning accessible and engaging. This guide will help you get started.

## 🌍 Our Mission

Monoko exists to eliminate language barriers across Africa by creating a beautiful, intuitive platform that blends technology, culture, and communication. We believe that language is belonging.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/monoko.git
cd monoko
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your local configuration
```

4. **Start the development servers**
```bash
npm run dev
```

This will start both the backend API server and the React Native development server.

## 🏗️ Project Structure

```
monoko/
├── frontend/           # React Native mobile app
│   ├── src/
│   │   ├── screens/    # App screens
│   │   ├── components/ # Reusable components
│   │   ├── store/      # Redux store
│   │   └── theme/      # Design system
├── backend/            # Node.js API server
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   └── middleware/     # Custom middleware
├── content/            # Language learning content
│   └── languages/      # Language-specific content
└── docs/               # Documentation
```

## 🎯 How to Contribute

### 1. Choose an Area

- **Frontend Development**: React Native, UI/UX, mobile app features
- **Backend Development**: API endpoints, database design, authentication
- **AI/ML Features**: Snap & Learn, speech recognition, image processing
- **Content Creation**: Language lessons, cultural notes, audio recordings
- **Design**: UI/UX design, illustrations, icons
- **Documentation**: Guides, tutorials, API documentation

### 2. Types of Contributions

#### 🐛 Bug Reports
- Use our bug report template
- Include steps to reproduce
- Add screenshots or screen recordings
- Specify device/platform details

#### ✨ Feature Requests
- Describe the problem you're solving
- Explain your proposed solution
- Consider cultural sensitivity for African contexts
- Think about offline functionality

#### 💻 Code Contributions
- Fork the repository
- Create a feature branch: `git checkout -b feature/amazing-feature`
- Follow our coding standards
- Write tests for new features
- Update documentation as needed

#### 📚 Content Contributions
- Native speakers are especially welcome!
- Add vocabulary, phrases, cultural notes
- Record audio pronunciations
- Review existing content for accuracy

### 3. Coding Standards

#### Frontend (React Native)
- Use functional components with hooks
- Follow the established theme system
- Implement proper error boundaries
- Ensure accessibility compliance
- Test on both iOS and Android

#### Backend (Node.js)
- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Include input validation
- Write comprehensive tests

#### General Guidelines
- Use meaningful commit messages
- Comment complex logic
- Keep functions small and focused
- Follow the existing code style
- Consider performance implications

## 🌐 Language and Cultural Guidelines

### Language Support Priority
1. **Primary**: Swahili, Lingala, Amharic
2. **Secondary**: Oromo, Somali, Zulu, Kikongo
3. **Future**: Additional African languages based on community demand

### Cultural Sensitivity
- Always collaborate with native speakers
- Include cultural context in lessons
- Respect regional variations
- Avoid stereotypes or oversimplifications
- Celebrate the richness of African cultures

### Content Standards
- Accuracy is paramount
- Include pronunciation guides
- Provide cultural context
- Use authentic examples
- Consider different proficiency levels

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📋 Pull Request Process

1. **Before You Start**
   - Check existing issues and PRs
   - Discuss major changes in an issue first
   - Ensure you understand the requirements

2. **Creating Your PR**
   - Use a descriptive title
   - Fill out the PR template completely
   - Link related issues
   - Include screenshots for UI changes
   - Add tests for new functionality

3. **Review Process**
   - All PRs require at least one review
   - Address feedback promptly
   - Keep PRs focused and reasonably sized
   - Ensure CI checks pass

4. **After Approval**
   - We'll merge your PR
   - Your contribution will be credited
   - Thank you for making Monoko better! 🎉

## 🏆 Recognition

Contributors are recognized in several ways:
- Listed in our README
- Featured in release notes
- Special contributor badges
- Community spotlight
- Conference speaking opportunities

## 📞 Getting Help

- **Discord**: Join our [development chat](https://discord.gg/monoko-dev)
- **Issues**: Create an issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: reach out to contributors@monoko.app

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Race, ethnicity, or nationality
- Gender identity or expression
- Sexual orientation
- Disability status
- Religion or belief system
- Age or experience level

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other contributors

### Enforcement
Violations of our code of conduct can be reported to conduct@monoko.app. All reports will be investigated promptly and fairly.

## 🙏 Thank You

Every contribution, no matter how small, helps us build a platform that connects people across Africa through language. Asante sana! Melesi mingi! Ameseginalehu!

---

**Ready to contribute?** Check out our [good first issues](https://github.com/yourusername/monoko/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and join our community of builders making African languages accessible to all.
