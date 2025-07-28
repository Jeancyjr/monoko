const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const mockDatabase = {
  sw: [
    {
      keywords: ['tree', 'plant', 'green', 'leaves', 'bark'],
      object: 'Mti',
      translation: 'Tree',
      pronunciation: 'mm-TEE',
      confidence: 0.95,
      examples: [
        'Mti mkubwa - Big tree',
        'Mti mdogo - Small tree',
        'Mti wa matunda - Fruit tree'
      ],
      culturalNote: 'Trees hold special significance in Swahili culture, often representing life, growth, and community gathering places.',
      relatedWords: [
        { word: 'Majani', meaning: 'Leaves' },
        { word: 'Mizizi', meaning: 'Roots' },
        { word: 'Matawi', meaning: 'Branches' }
      ]
    },
    {
      keywords: ['car', 'vehicle', 'transport', 'wheel', 'road'],
      object: 'Gari',
      translation: 'Car',
      pronunciation: 'GAH-ree',
      confidence: 0.92,
      examples: [
        'Gari jekundu - Red car',
        'Gari la haraka - Fast car',
        'Gari la abiria - Passenger car'
      ],
      culturalNote: 'Cars represent modern transportation in East Africa, often shared within communities.',
      relatedWords: [
        { word: 'Barabara', meaning: 'Road' },
        { word: 'Dereva', meaning: 'Driver' },
        { word: 'Magurudumu', meaning: 'Wheels' }
      ]
    },
    {
      keywords: ['house', 'building', 'home', 'roof', 'door'],
      object: 'Nyumba',
      translation: 'House',
      pronunciation: 'NYOOM-bah',
      confidence: 0.88,
      examples: [
        'Nyumba kubwa - Big house',
        'Nyumba ndogo - Small house',
        'Nyumba ya familia - Family house'
      ],
      culturalNote: 'Houses in Swahili culture are centers of family life and community gathering.',
      relatedWords: [
        { word: 'Mlango', meaning: 'Door' },
        { word: 'Paa', meaning: 'Roof' },
        { word: 'Chumba', meaning: 'Room' }
      ]
    }
  ],
  ln: [
    {
      keywords: ['tree', 'plant', 'green', 'leaves', 'bark'],
      object: 'Nzete',
      translation: 'Tree',
      pronunciation: 'nn-ZEH-teh',
      confidence: 0.92,
      examples: [
        'Nzete ya monene - Big tree',
        'Nzete ya mike - Small tree',
        'Nzete ya mbuma - Fruit tree'
      ],
      culturalNote: 'In Lingala culture, trees are symbols of wisdom and ancestral connection, often featured in traditional stories.',
      relatedWords: [
        { word: 'Nkasa', meaning: 'Leaves' },
        { word: 'Misisa', meaning: 'Roots' },
        { word: 'Bitape', meaning: 'Branches' }
      ]
    },
    {
      keywords: ['car', 'vehicle', 'transport', 'wheel', 'road'],
      object: 'Motuka',
      translation: 'Car',
      pronunciation: 'moh-TOO-kah',
      confidence: 0.89,
      examples: [
        'Motuka ya motane - Red car',
        'Motuka ya mbangu - Fast car',
        'Motuka ya bato - People\'s car'
      ],
      culturalNote: 'Cars in Central Africa often serve entire communities for transportation.',
      relatedWords: [
        { word: 'Nzela', meaning: 'Road' },
        { word: 'Motambi', meaning: 'Driver' },
        { word: 'Bapine', meaning: 'Wheels' }
      ]
    }
  ],
  am: [
    {
      keywords: ['tree', 'plant', 'green', 'leaves', 'bark'],
      object: 'ዛፍ',
      translation: 'Tree',
      pronunciation: 'zahf',
      confidence: 0.89,
      examples: [
        'ትልቅ ዛፍ - Big tree',
        'ትንሽ ዛፍ - Small tree',
        'የፍራፍሬ ዛፍ - Fruit tree'
      ],
      culturalNote: 'Trees in Ethiopian culture represent endurance and spiritual connection, often planted near churches and homes.',
      relatedWords: [
        { word: 'ቅጠል', meaning: 'Leaves' },
        { word: 'ሥር', meaning: 'Roots' },
        { word: 'ቅርንጫፍ', meaning: 'Branches' }
      ]
    },
    {
      keywords: ['car', 'vehicle', 'transport', 'wheel', 'road'],
      object: 'መኪና',
      translation: 'Car',
      pronunciation: 'meh-KEE-nah',
      confidence: 0.91,
      examples: [
        'ቀይ መኪና - Red car',
        'ፈጣን መኪና - Fast car',
        'የመንገደኞች መኪና - Passenger car'
      ],
      culturalNote: 'Cars in Ethiopia are often symbols of progress and modernity in urban areas.',
      relatedWords: [
        { word: 'መንገድ', meaning: 'Road' },
        { word: 'ሹፌር', meaning: 'Driver' },
        { word: 'ጎማ', meaning: 'Tire' }
      ]
    }
  ]
};

const analyzeImageContent = (language) => {
  const objects = mockDatabase[language] || mockDatabase.sw;
  const randomIndex = Math.floor(Math.random() * objects.length);
  return objects[randomIndex];
};

router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = analyzeImageContent(language);
    
    res.json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;
