module.exports = {
  SERVER_URL: 'http://localhost:5000',
  CROP_DATA: ['Winterweizen', 'Sommerweizen', 'Mais'],
  VARIETY_DATA: ['Akteur', 'Alexander', 'Alfons', 'Alpha'],
  GROWTH_DATA: [
    'BBCH 20',
    'BBCH 21',
    'BBCH 22',
    'BBCH 23',
    'BBCH 24',
    'BBCH 25',
    'BBCH 26',
    'BBCH 27',
    'BBCH 28',
    'BBCH 29',
  ],
  SOWING_DATA: ['früh', 'normal', 'spät'],
  CAROUSEL_ITEMS: [
    {
      title: 'Blattwahl',
      text:
        'Die besten Messwerte werden erzielt, wenn einzelne Blätter fotografiert werden. Um vergleichbare Werte zu haben, nutzen Sie dazu am besten das letzte voll entwickelte Blatt (Fahnenblatt).',
      thumbnail: require('../assets/fahnenblatt.jpeg'),
    },
    {
      title: 'Belichtung',
      text:
        'Vermeiden Sie direkte Sonneneinstrahlung oder Schattenwurf und sorgen Sie für eine einheitliche Belichtungssituation.',
      thumbnail: require('../assets/sonne.jpeg'),
    },
    {
      title: 'Hintergrund',
      text:
        'Versuchen Sie einen einheitlichen Hintergrund zu wählen, halten Sie zum Beispiel ein weißes Papier hinter das Blatt. Alle nicht pflanzlichen Gegenstände auf dem Bild können zu ungenauen Ergebnissen führen.',
      thumbnail: require('../assets/erde.jpeg'),
    },
  ],
};
