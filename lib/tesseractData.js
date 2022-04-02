export const journeyStatuses = {
  1: ['loading tesseract core'],
  2: ['initializing tesseract', 'initialized tesseract'],
  3: ['loading language traineddata', 'loading language traineddata (from cache)', 'loaded language traineddata'],
  4: ['initializing api', 'initialized api'],
  5: ['recognizing text'],
}

export const journeyData = {
  1: {
    id: '1',
    name: 'Loading Tesseract Core',
    progress: 0,
  },
  2: {
    id: '2',
    name: 'Initialize Tesseract',
    progress: 0,
  },
  3: {
    id: '3',
    name: 'Loading Language Trained Data',
    progress: 0,
  },
  4: {
    id: '4',
    name: 'Initialize API',
    progress: 0,
  },
  5: {
    id: '5',
    name: 'Recognizing Text',
    progress: 0,
  },
}
