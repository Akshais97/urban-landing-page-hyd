export const photos = [
  { slide: 9, file: 'private-bar', abundance: 'Celebrations', name: 'Private bar', alt: 'A private bar with pendant lighting, bar stools and a lounge for gathering with friends.' },
  { slide: 10, file: 'kitchen-garden', abundance: 'Harvest', name: 'Kitchen garden', alt: 'A resident harvesting vegetables from planted kitchen garden beds at sunset.' },
  { slide: 4, file: 'meditation-deck', abundance: 'Stillness', name: 'Meditation deck', alt: 'A quiet timber meditation deck surrounded by trees and flowering gardens.' },
  { slide: 7, file: 'wellness-centre', abundance: 'Wellbeing', name: 'Wellness centre', alt: 'A wellness centre with a massage room, natural stone finishes and a calm reception lounge.' },
  { slide: 6, file: 'sauna', abundance: 'Rejuvenation', name: 'Sauna', alt: 'A warm timber sauna inside the wellness facilities.' },
  { slide: 5, file: 'red-light-therapy', abundance: 'Renewal', name: 'Red-light therapy', alt: 'A dedicated treatment room with a red-light therapy bed.' },
  { slide: 8, file: 'physiotherapy', abundance: 'Vitality', name: 'Physiotherapy studio', alt: 'A physiotherapy studio with a treatment table, exercise equipment and a therapist assisting a resident.' },
  { slide: 12, file: 'garden-walks', abundance: 'Nature', name: 'Garden walks', alt: 'A shaded stepping-stone path winding through lush gardens.' },
  { slide: 13, file: 'waterside-seating', abundance: 'Tranquillity', name: 'Waterside seating', alt: 'Terraced seating overlooking a planted pond with water lilies and ducks.' },
  { slide: 16, file: 'community-courtyard', abundance: 'Togetherness', name: 'Community courtyard', alt: 'A landscaped shared courtyard with shaded seating, garden paths and spaces to gather.' },
];

export const imageUrl = (photo, width = 1600) => `${import.meta.env.BASE_URL}gallery/amenities/${photo.file}-${width}.webp`;
export const imageSet = photo => `${imageUrl(photo, 800)} 800w, ${imageUrl(photo)} 1600w`;
