// Curated, high-resolution portrait avatars matching historical and modern aesthetic
export const AVATAR_PRESETS = {
  sarah: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  james: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  elizabeth: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  david: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  chloe: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  robert: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  anna: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  grandpa1: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  grandma1: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  uncle1: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  aunt1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  elderMan: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  elderWoman: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  youngMan: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  youngWoman: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  childBoy: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&auto=format&fit=crop&q=80',
  childGirl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&auto=format&fit=crop&q=80'
};

export const INITIAL_MEMBERS = [
  // ─── FOCUS ROOT (GEN IV) ───────────────────────────────────────────────
  {
    id: 'sarah-johnson-1891',
    firstName: 'SARAH',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1891',
    deathYear: null,
    birthPlace: 'Boston, Massachusetts, USA',
    occupation: 'Pioneering Architect & Botanical Conservator',
    avatar: AVATAR_PRESETS.sarah,
    generation: 4,
    branch: 'root',
    bio: 'Sarah Johnson was a visionary leader and botanical architect whose innovative preservation methodologies established sustainable estate designs across the northeastern seaboard. Central matriarch of the Johnson Atlas.',
    vitalStats: {
      birthDate: 'October 14, 1891',
      deathDate: 'Living Legacy',
      location: 'Boston, MA',
      occupation: 'Architect',
      childrenCount: 4,
      spousesCount: 1
    },
    timeline: [
      { year: '1891', title: 'Birth of Sarah Johnson', description: 'Born in Boston to James and Elizabeth Johnson.', type: 'birth' },
      { year: '1912', title: 'Graduation from Design Guild', description: 'Graduated with highest honors in Architectural Draftsmanship.', type: 'milestone' },
      { year: '1918', title: 'Marriage to David Vance', description: 'Married David Vance in an autumn garden ceremony.', type: 'marriage' },
      { year: '1920', title: 'Birth of First Daughter (Sarah Jr.)', description: 'Welcome of the next generation.', type: 'milestone' },
      { year: '1938', title: 'Grand Estate Fellowship Award', description: 'Recognized by the National Historic Landmarks Foundation.', type: 'milestone' }
    ]
  },

  // ─── GEN IV: PARENTS & PARTNERS ─────────────────────────────────────────
  {
    id: 'james-johnson-1962',
    firstName: 'JAMES',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1962',
    deathYear: null,
    birthPlace: 'Cambridge, MA',
    occupation: 'Civil Engineer & Industrialist',
    avatar: AVATAR_PRESETS.james,
    generation: 4,
    branch: 'paternal',
    bio: 'Father of Sarah Johnson. Known for large-scale bridge engineering and civic philanthropy.',
    vitalStats: { birthDate: 'March 18, 1962', location: 'Cambridge, MA', childrenCount: 3, spousesCount: 1 },
    timeline: [
      { year: '1962', title: 'Birth of James Johnson', description: 'Born to Robert and Anna Johnson.', type: 'birth' },
      { year: '1984', title: 'Married Elizabeth Harper', description: 'Joined two prominent engineering families.', type: 'marriage' }
    ]
  },
  {
    id: 'elizabeth-harper-1964',
    firstName: 'ELIZABETH',
    lastName: 'JOHNSON',
    maidenName: 'HARPER',
    gender: 'female',
    birthYear: '1964',
    deathYear: null,
    birthPlace: 'Hartford, CT',
    occupation: 'Professor of Literature & Dean',
    avatar: AVATAR_PRESETS.elizabeth,
    generation: 4,
    branch: 'maternal',
    bio: 'Mother of Sarah Johnson. Authored numerous critical anthologies and established women scholarship endowments.',
    vitalStats: { birthDate: 'June 22, 1964', location: 'Hartford, CT', childrenCount: 3, spousesCount: 1 },
    timeline: [
      { year: '1964', title: 'Birth of Elizabeth Harper', description: 'Born in Hartford.', type: 'birth' },
      { year: '1984', title: 'Marriage to James Johnson', description: 'Celebrated union at Trinity Chapel.', type: 'marriage' }
    ]
  },
  {
    id: 'david-vance-1963',
    firstName: 'DAVID',
    lastName: 'VANCE',
    gender: 'male',
    birthYear: '1963',
    deathYear: null,
    birthPlace: 'Providence, RI',
    occupation: 'Maritime Historian & Author',
    avatar: AVATAR_PRESETS.david,
    generation: 4,
    branch: 'spouse',
    bio: 'Devoted partner and co-explorer with Sarah Johnson. Curated Atlantic maritime artifacts.',
    vitalStats: { birthDate: 'September 5, 1963', location: 'Providence, RI', childrenCount: 4, spousesCount: 1 },
    timeline: [
      { year: '1963', title: 'Birth of David Vance', description: 'Born in Providence.', type: 'birth' },
      { year: '1988', title: 'Union with Sarah Johnson', description: 'Lifelong creative and family partnership.', type: 'marriage' }
    ]
  },
  {
    id: 'chloe-vance-1962',
    firstName: 'CHLOE',
    lastName: 'VANCE',
    gender: 'female',
    birthYear: '1962',
    deathYear: null,
    birthPlace: 'Newport, RI',
    occupation: 'Classical Musician & Composer',
    avatar: AVATAR_PRESETS.chloe,
    generation: 4,
    branch: 'spouse',
    bio: 'Sister-in-law to Sarah and patron of the regional symphony.',
    vitalStats: { birthDate: 'July 11, 1962', location: 'Newport, RI' }
  },

  // ─── GEN III: GRANDPARENTS, AUNTS & UNCLES ──────────────────────────────
  {
    id: 'robert-johnson-1962',
    firstName: 'ROBERT',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1962',
    deathYear: null,
    birthPlace: 'Boston, MA',
    occupation: 'Merchant & Port Commissioner',
    avatar: AVATAR_PRESETS.robert,
    generation: 3,
    branch: 'paternal',
    bio: 'Paternal Grandfather. Expanded the family trading operations along the Atlantic seaboard.',
    vitalStats: { birthDate: '1962', location: 'Boston, MA', childrenCount: 4 }
  },
  {
    id: 'anna-johnson-1964',
    firstName: 'ANNA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1964',
    deathYear: null,
    birthPlace: 'Salem, MA',
    occupation: 'Horticulturist & Civic Leader',
    avatar: AVATAR_PRESETS.anna,
    generation: 3,
    branch: 'paternal',
    bio: 'Paternal Grandmother. Created the Johnson arboretum collection.',
    vitalStats: { birthDate: '1964', location: 'Salem, MA', childrenCount: 4 }
  },
  {
    id: 'uncle-robert-1950',
    firstName: 'UNCLE',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1950',
    deathYear: null,
    birthPlace: 'Boston, MA',
    occupation: 'Magistrate & Scholar',
    avatar: AVATAR_PRESETS.uncle1,
    generation: 3,
    branch: 'paternal',
    bio: 'Respected jurist and family historian.',
    vitalStats: { birthDate: '1950', location: 'Boston, MA' }
  },
  {
    id: 'aunts-eleanor-1922',
    firstName: 'AUNTS',
    lastName: 'ELEANOR',
    gender: 'female',
    birthYear: '1922',
    deathYear: null,
    birthPlace: 'Concord, MA',
    occupation: 'Author & Archivist',
    avatar: AVATAR_PRESETS.aunt1,
    generation: 3,
    branch: 'paternal',
    bio: 'Recorded oral histories of five generations.',
    vitalStats: { birthDate: '1922', location: 'Concord, MA' }
  },
  {
    id: 'borert-1962',
    firstName: 'BORERT',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1962',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 3,
    branch: 'paternal'
  },
  {
    id: 'scnlrt-1955',
    firstName: 'SCNLRT',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1955',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 3,
    branch: 'paternal'
  },
  {
    id: 'anna-johnson-1982',
    firstName: 'ANNA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1982',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 3,
    branch: 'paternal'
  },
  {
    id: 'diomst-1962',
    firstName: 'DIOMST',
    lastName: 'HARPER',
    gender: 'male',
    birthYear: '1962',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 3,
    branch: 'maternal'
  },
  {
    id: 'anna-1982-mat',
    firstName: 'ANNA',
    lastName: 'HARPER',
    gender: 'female',
    birthYear: '1982',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 3,
    branch: 'maternal'
  },
  {
    id: 'uncle-mat-1902',
    firstName: 'UNCLE',
    lastName: 'HARPER',
    gender: 'male',
    birthYear: '1902',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 3,
    branch: 'maternal'
  },

  // ─── GEN II: GREAT GRANDPARENTS & EXTENDED FOREBEARS ────────────────────
  {
    id: 'a8uma-1953',
    firstName: 'ABUMA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1953',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderWoman,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'amnet-1952',
    firstName: 'AMNET',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1952',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'a6mce-190x',
    firstName: 'ASMCE',
    lastName: 'HARPER',
    gender: 'female',
    birthYear: '1908',
    deathYear: null,
    avatar: AVATAR_PRESETS.grandma1,
    generation: 2,
    branch: 'maternal'
  },
  {
    id: 'james-johnson-1965',
    firstName: 'JAMES',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'danby-johnson-1965',
    firstName: 'DANDY',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'sarah-johnson-1961',
    firstName: 'SARAH',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1961',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderWoman,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'saran-johnson-1905',
    firstName: 'SARAN',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1905',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 2,
    branch: 'paternal'
  },
  {
    id: 'ghori-johnson-1965',
    firstName: 'GHOBI',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 2,
    branch: 'maternal'
  },
  {
    id: 'mina-farara-1906',
    firstName: 'MINA',
    lastName: 'FARARA',
    gender: 'female',
    birthYear: '1906',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderWoman,
    generation: 2,
    branch: 'maternal'
  },
  {
    id: 'mador-johneon-1906',
    firstName: 'MADOR',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1906',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 2,
    branch: 'maternal'
  },
  {
    id: 'james-johnson-1865',
    firstName: 'JAMES',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1865',
    deathYear: '1942',
    avatar: AVATAR_PRESETS.elderMan,
    generation: 2,
    branch: 'maternal'
  },
  {
    id: 'nancy-johnson-1965',
    firstName: 'NANCY',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 2,
    branch: 'maternal'
  },

  // ─── GEN I: ANCESTRAL ROOTS & PATRIARCHS ───────────────────────────────
  {
    id: 'robert-johnson-1961',
    firstName: 'ROBERT',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1961',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 1,
    branch: 'paternal'
  },
  {
    id: 'james-johnson-1962',
    firstName: 'JAMES',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1962',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderMan,
    generation: 1,
    branch: 'paternal'
  },
  {
    id: 'ranica-johnson-1906',
    firstName: 'RANICA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1906',
    deathYear: null,
    avatar: AVATAR_PRESETS.grandma1,
    generation: 1,
    branch: 'maternal'
  },
  {
    id: 'dania-johnson-1906',
    firstName: 'DANIA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1906',
    deathYear: null,
    avatar: AVATAR_PRESETS.elderWoman,
    generation: 1,
    branch: 'maternal'
  },
  {
    id: 'jane-elicaureth-1904',
    firstName: 'JANE',
    lastName: 'ELIZABETH',
    gender: 'female',
    birthYear: '1904',
    deathYear: null,
    avatar: AVATAR_PRESETS.grandma1,
    generation: 1,
    branch: 'paternal'
  },
  {
    id: 'aonte-1962',
    firstName: 'AONTE',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1962',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 1,
    branch: 'paternal'
  },

  // ─── GEN V: CHILDREN & NEXT GENERATION (DOWNWARD ARC) ───────────────────
  {
    id: 'saran-johnson-1931',
    firstName: 'SARAN',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1931',
    deathYear: null,
    birthPlace: 'Boston, MA',
    occupation: 'Naval Architect',
    avatar: AVATAR_PRESETS.youngMan,
    generation: 5,
    branch: 'descendant',
    bio: 'Eldest son of Sarah Johnson. Designed revolutionary racing yachts.',
    vitalStats: { birthDate: '1931', location: 'Boston, MA', childrenCount: 3 }
  },
  {
    id: 'sarah-johnson-1951',
    firstName: 'SARAH',
    lastName: 'JOHNSON JR',
    gender: 'female',
    birthYear: '1951',
    deathYear: null,
    birthPlace: 'Boston, MA',
    occupation: 'Botanist & Educator',
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 5,
    branch: 'descendant',
    bio: 'Daughter of Sarah Johnson. Continued maternal conservation projects.',
    vitalStats: { birthDate: '1951', location: 'Boston, MA', childrenCount: 2 }
  },
  {
    id: 'saren-johnson-1951',
    firstName: 'SAREN',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1951',
    deathYear: null,
    avatar: AVATAR_PRESETS.aunt1,
    generation: 5,
    branch: 'descendant'
  },
  {
    id: 'saren-johnson-1987',
    firstName: 'SAREN',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1987',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 5,
    branch: 'descendant'
  },
  {
    id: 'baitria-1965',
    firstName: 'BAITRIA',
    lastName: 'VANCE',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 5,
    branch: 'spouse'
  },
  {
    id: 'james-jr-1968',
    firstName: 'JAMES',
    lastName: 'VANCE',
    gender: 'male',
    birthYear: '1968',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 5,
    branch: 'spouse'
  },
  {
    id: 'bobary-1964',
    firstName: 'BOBARY',
    lastName: 'VANCE',
    gender: 'male',
    birthYear: '1964',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 5,
    branch: 'spouse'
  },

  // ─── GEN VI: GRANDCHILDREN ─────────────────────────────────────────────
  {
    id: 'saaan-johnson-1941',
    firstName: 'SAAAN',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1941',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'rony-johnson-1965',
    firstName: 'RONY',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'saran-johnson-1966',
    firstName: 'SARAN',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1966',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'aaran-johnson-1966',
    firstName: 'AARAN',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1966',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'nawit-johnson-1961',
    firstName: 'NAWIT',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1961',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'adla-johnson-1965',
    firstName: 'ADLA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'anura-johnson-1965',
    firstName: 'ANURA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1965',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 6,
    branch: 'descendant'
  },
  {
    id: 'sadati-johnson-1967',
    firstName: 'SADATI',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1967',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngMan,
    generation: 6,
    branch: 'descendant'
  },

  // ─── GEN VII: GREAT-GRANDCHILDREN (OUTER DESCENDANTS) ───────────────────
  {
    id: 'aldeg-johnson-1988',
    firstName: 'ALDEG',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1988',
    deathYear: null,
    avatar: AVATAR_PRESETS.childBoy,
    generation: 7,
    branch: 'descendant'
  },
  {
    id: 'srala-johnson-1981',
    firstName: 'SRALA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1981',
    deathYear: null,
    avatar: AVATAR_PRESETS.childGirl,
    generation: 7,
    branch: 'descendant'
  },
  {
    id: 'nouy-johnson-1969',
    firstName: 'NOUY',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1969',
    deathYear: null,
    avatar: AVATAR_PRESETS.youngWoman,
    generation: 7,
    branch: 'descendant'
  },
  {
    id: 'lafss-johnson-1989',
    firstName: 'LAFSS',
    lastName: 'JOHNSON',
    gender: 'male',
    birthYear: '1989',
    deathYear: null,
    avatar: AVATAR_PRESETS.childBoy,
    generation: 7,
    branch: 'descendant'
  },
  {
    id: 'doniia-johnson-1968',
    firstName: 'DONIIA',
    lastName: 'JOHNSON',
    gender: 'female',
    birthYear: '1968',
    deathYear: null,
    avatar: AVATAR_PRESETS.childGirl,
    generation: 7,
    branch: 'descendant'
  }
];

export const INITIAL_RELATIONSHIPS = [
  // ─── Direct Ancestry for Sarah ──────────────────────────────────────────
  { id: 'rel-1', from: 'james-johnson-1962', to: 'sarah-johnson-1891', type: 'parent-child' },
  { id: 'rel-2', from: 'elizabeth-harper-1964', to: 'sarah-johnson-1891', type: 'parent-child' },
  { id: 'rel-3', from: 'james-johnson-1962', to: 'elizabeth-harper-1964', type: 'marriage' },
  { id: 'rel-4', from: 'sarah-johnson-1891', to: 'david-vance-1963', type: 'marriage' },
  { id: 'rel-5', from: 'david-vance-1963', to: 'chloe-vance-1962', type: 'sibling' },

  // ─── Paternal Lineage (James's Ancestry) ─────────────────────────────────
  { id: 'rel-6', from: 'robert-johnson-1962', to: 'james-johnson-1962', type: 'parent-child' },
  { id: 'rel-7', from: 'anna-johnson-1964', to: 'james-johnson-1962', type: 'parent-child' },
  { id: 'rel-8', from: 'robert-johnson-1962', to: 'anna-johnson-1964', type: 'marriage' },
  { id: 'rel-9', from: 'robert-johnson-1962', to: 'uncle-robert-1950', type: 'sibling' },
  { id: 'rel-10', from: 'robert-johnson-1962', to: 'aunts-eleanor-1922', type: 'sibling' },
  { id: 'rel-11', from: 'robert-johnson-1962', to: 'borert-1962', type: 'sibling' },
  { id: 'rel-12', from: 'robert-johnson-1962', to: 'scnlrt-1955', type: 'sibling' },
  { id: 'rel-13', from: 'anna-johnson-1964', to: 'anna-johnson-1982', type: 'sibling' },

  // ─── Maternal Lineage (Elizabeth's Ancestry) ────────────────────────────
  { id: 'rel-14', from: 'diomst-1962', to: 'elizabeth-harper-1964', type: 'parent-child' },
  { id: 'rel-15', from: 'anna-1982-mat', to: 'elizabeth-harper-1964', type: 'parent-child' },
  { id: 'rel-16', from: 'diomst-1962', to: 'uncle-mat-1902', type: 'sibling' },

  // ─── Gen II Ancestry ───────────────────────────────────────────────────
  { id: 'rel-17', from: 'a8uma-1953', to: 'robert-johnson-1962', type: 'parent-child' },
  { id: 'rel-18', from: 'amnet-1952', to: 'robert-johnson-1962', type: 'parent-child' },
  { id: 'rel-19', from: 'a6mce-190x', to: 'anna-johnson-1964', type: 'parent-child' },
  { id: 'rel-20', from: 'james-johnson-1965', to: 'a8uma-1953', type: 'sibling' },
  { id: 'rel-21', from: 'danby-johnson-1965', to: 'a8uma-1953', type: 'sibling' },
  { id: 'rel-22', from: 'sarah-johnson-1961', to: 'amnet-1952', type: 'sibling' },
  { id: 'rel-23', from: 'saran-johnson-1905', to: 'amnet-1952', type: 'sibling' },
  { id: 'rel-24', from: 'ghori-johnson-1965', to: 'a6mce-190x', type: 'sibling' },
  { id: 'rel-25', from: 'mina-farara-1906', to: 'a6mce-190x', type: 'sibling' },
  { id: 'rel-26', from: 'mador-johneon-1906', to: 'diomst-1962', type: 'parent-child' },
  { id: 'rel-27', from: 'james-johnson-1865', to: 'diomst-1962', type: 'parent-child' },
  { id: 'rel-28', from: 'nancy-johnson-1965', to: 'diomst-1962', type: 'sibling' },

  // ─── Gen I Roots ───────────────────────────────────────────────────────
  { id: 'rel-29', from: 'robert-johnson-1961', to: 'amnet-1952', type: 'parent-child' },
  { id: 'rel-30', from: 'james-johnson-1962', to: 'amnet-1952', type: 'parent-child' },
  { id: 'rel-31', from: 'ranica-johnson-1906', to: 'a8uma-1953', type: 'parent-child' },
  { id: 'rel-32', from: 'dania-johnson-1906', to: 'a6mce-190x', type: 'parent-child' },
  { id: 'rel-33', from: 'jane-elicaureth-1904', to: 'danby-johnson-1965', type: 'parent-child' },
  { id: 'rel-34', from: 'aonte-1962', to: 'sarah-johnson-1961', type: 'parent-child' },

  // ─── Descendant Lines (Sarah & David's Lineage - Gen V) ─────────────────
  { id: 'rel-35', from: 'sarah-johnson-1891', to: 'saran-johnson-1931', type: 'parent-child' },
  { id: 'rel-36', from: 'sarah-johnson-1891', to: 'sarah-johnson-1951', type: 'parent-child' },
  { id: 'rel-37', from: 'sarah-johnson-1891', to: 'saren-johnson-1951', type: 'parent-child' },
  { id: 'rel-38', from: 'sarah-johnson-1891', to: 'saren-johnson-1987', type: 'parent-child' },
  { id: 'rel-39', from: 'david-vance-1963', to: 'baitria-1965', type: 'parent-child' },
  { id: 'rel-40', from: 'david-vance-1963', to: 'james-jr-1968', type: 'parent-child' },
  { id: 'rel-41', from: 'david-vance-1963', to: 'bobary-1964', type: 'parent-child' },

  // ─── Gen VI Grandchildren ──────────────────────────────────────────────
  { id: 'rel-42', from: 'saran-johnson-1931', to: 'saaan-johnson-1941', type: 'parent-child' },
  { id: 'rel-43', from: 'saran-johnson-1931', to: 'rony-johnson-1965', type: 'parent-child' },
  { id: 'rel-44', from: 'sarah-johnson-1951', to: 'saran-johnson-1966', type: 'parent-child' },
  { id: 'rel-45', from: 'sarah-johnson-1951', to: 'aaran-johnson-1966', type: 'parent-child' },
  { id: 'rel-46', from: 'saren-johnson-1951', to: 'nawit-johnson-1961', type: 'parent-child' },
  { id: 'rel-47', from: 'saren-johnson-1987', to: 'adla-johnson-1965', type: 'parent-child' },
  { id: 'rel-48', from: 'james-jr-1968', to: 'anura-johnson-1965', type: 'parent-child' },
  { id: 'rel-49', from: 'bobary-1964', to: 'sadati-johnson-1967', type: 'parent-child' },

  // ─── Gen VII Great-Grandchildren ───────────────────────────────────────
  { id: 'rel-50', from: 'saaan-johnson-1941', to: 'aldeg-johnson-1988', type: 'parent-child' },
  { id: 'rel-51', from: 'rony-johnson-1965', to: 'srala-johnson-1981', type: 'parent-child' },
  { id: 'rel-52', from: 'saran-johnson-1966', to: 'nouy-johnson-1969', type: 'parent-child' },
  { id: 'rel-53', from: 'aaran-johnson-1966', to: 'lafss-johnson-1989', type: 'parent-child' },
  { id: 'rel-54', from: 'anura-johnson-1965', to: 'doniia-johnson-1968', type: 'parent-child' }
];
