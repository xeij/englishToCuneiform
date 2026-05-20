// Old Persian Cuneiform Translator
// Based on scholarly sources: Roland G. Kent's "Old Persian: Grammar, Texts, Lexicon" (1953),
// Rüdiger Schmitt's "Die altpersischen Inschriften der Achaimeniden" (2009),
// and the Unicode Old Persian block (U+103A0..U+103DF).

// === SIGN INVENTORY ===
// Vowels
const A  = '\u{103A0}';  // 𐎠
const I  = '\u{103A1}';  // 𐎡
const U  = '\u{103A2}';  // 𐎢

// Consonant + vowel syllables
const KA = '\u{103A3}';  // 𐎣
const KU = '\u{103A4}';  // 𐎤
const GA = '\u{103A5}';  // 𐎥
const GU = '\u{103A6}';  // 𐎦
const XA = '\u{103A7}';  // 𐎧  (kh)
const CA = '\u{103A8}';  // 𐎨  (ch)
const JA = '\u{103A9}';  // 𐎩
const JI = '\u{103AA}';  // 𐎪
const TA = '\u{103AB}';  // 𐎫
const TU = '\u{103AC}';  // 𐎬
const DA = '\u{103AD}';  // 𐎭
const DI = '\u{103AE}';  // 𐎮
const DU = '\u{103AF}';  // 𐎯
const THA= '\u{103B0}';  // 𐎰  (th, θ)
const PA = '\u{103B1}';  // 𐎱
const BA = '\u{103B2}';  // 𐎲
const FA = '\u{103B3}';  // 𐎳
const NA = '\u{103B4}';  // 𐎴
const NU = '\u{103B5}';  // 𐎵
const MA = '\u{103B6}';  // 𐎶
const MI = '\u{103B7}';  // 𐎷
const MU = '\u{103B8}';  // 𐎸
const YA = '\u{103B9}';  // 𐎹
const VA = '\u{103BA}';  // 𐎺
const VI = '\u{103BB}';  // 𐎻
const RA = '\u{103BC}';  // 𐎼
const RU = '\u{103BD}';  // 𐎽
const LA = '\u{103BE}';  // 𐎾
const SA = '\u{103BF}';  // 𐎿
const ZA = '\u{103C0}';  // 𐏀
const SHA= '\u{103C1}';  // 𐏁  (sh, š)
const CCA= '\u{103C2}';  // 𐏂  (ç, tsa)
const HA = '\u{103C3}';  // 𐏃

// Logograms (ideograms)
const LOGO_AURAMAZDA   = '\u{103C8}';  // 𐏈  Auramazdā (nominative)
const LOGO_AURAMAZDA2  = '\u{103C9}';  // 𐏉  Auramazdā (alt)
const LOGO_AURAMAZDAHA = '\u{103CA}';  // 𐏊  Auramazdāha (genitive)
const LOGO_KING        = '\u{103CB}';  // 𐏋  xšāyaθiya (king)
const LOGO_COUNTRY     = '\u{103CC}';  // 𐏌  dahyāuš (country)
const LOGO_COUNTRIES   = '\u{103CD}';  // 𐏍  dahyūnām (of countries)
const LOGO_BAGA        = '\u{103CE}';  // 𐏎  baga (god)
const LOGO_BUMI        = '\u{103CF}';  // 𐏏  būmi (earth)

// Word divider
const DIV = '\u{103D0}';  // 𐏐

// Numerals
const N1   = '\u{103D1}'; // 𐏑  one
const N2   = '\u{103D2}'; // 𐏒  two
const N10  = '\u{103D3}'; // 𐏓  ten
const N20  = '\u{103D4}'; // 𐏔  twenty
const N100 = '\u{103D5}'; // 𐏕  hundred

// === DICTIONARY OF KNOWN OLD PERSIAN WORDS ===
// English (lowercase) -> { op: cuneiform, translit: romanization }
// Sources: Kent, Schmitt, Skjaervo's Old Persian Primer (2002),
// and the Behistun, Naqsh-e Rustam, Persepolis, and Susa inscriptions.
const DICTIONARY = {
  // ---- Pronouns ----
  'i':         { op: A + DA + MA,                          translit: 'adam' },
  'me':        { op: MA + MA,                              translit: 'mām' },
  'my':        { op: MA + NA + A,                          translit: 'manā' },
  'mine':      { op: MA + NA + A,                          translit: 'manā' },
  'thou':      { op: TU + VA + MA,                         translit: 'tuvam' },
  'you':       { op: TU + VA + MA,                         translit: 'tuvam' },
  'thy':       { op: TA + U + VA,                          translit: 'tava' },
  'your':      { op: TA + U + VA,                          translit: 'tava' },
  'we':        { op: VA + YA + MA,                         translit: 'vayam' },
  'us':        { op: A + MA + A + XA + MA,                 translit: 'amāxam' },
  'this':      { op: I + MA,                               translit: 'ima' },
  'that':      { op: A + VA,                               translit: 'ava' },
  'who':       { op: HA + YA,                              translit: 'haya' },
  'what':      { op: TA + YA,                              translit: 'taya' },
  'he':        { op: HA + U + VA,                          translit: 'hauv' },
  'she':       { op: HA + U + VA,                          translit: 'hauv' },
  'they':      { op: A + VA + I + SHA + A + MA,            translit: 'avaišām' },

  // ---- Royal & divine vocabulary ----
  'king':         { op: LOGO_KING,                                       translit: 'xšāyaθiya' },
  'kings':        { op: LOGO_KING + A + NA + A + MA,                     translit: 'xšāyaθiyānām' },
  'kingship':     { op: XA + SHA + A + CCA + MA,                         translit: 'xšaçam' },
  'kingdom':      { op: XA + SHA + A + CCA + MA,                         translit: 'xšaçam' },
  'great':        { op: VA + ZA + RA + KA,                               translit: 'vazraka' },
  'mighty':       { op: VA + ZA + RA + KA,                               translit: 'vazraka' },
  'god':          { op: LOGO_BAGA,                                       translit: 'baga' },
  'lord':         { op: LOGO_BAGA,                                       translit: 'baga' },
  'auramazda':    { op: LOGO_AURAMAZDA,                                  translit: 'Auramazdā' },
  'ahuramazda':   { op: LOGO_AURAMAZDA,                                  translit: 'Auramazdā' },

  // ---- Peoples & places ----
  'persia':       { op: PA + A + RA + SA,                                translit: 'Pārsa' },
  'persian':      { op: PA + A + RA + SA,                                translit: 'Pārsa' },
  'aryan':        { op: A + RA + I + YA,                                 translit: 'Ariya' },
  'iran':         { op: A + RA + I + YA + A + NA + A + MA,               translit: 'Ariyānām' },
  'media':        { op: MA + A + DA,                                     translit: 'Māda' },
  'mede':         { op: MA + A + DA,                                     translit: 'Māda' },
  'babylon':      { op: BA + A + BA + I + RA + U + SHA,                  translit: 'Bābiruš' },
  'egypt':        { op: MU + DA + RA + A + YA,                           translit: 'Mudrāya' },
  'india':        { op: HA + I + DA + U + SHA,                           translit: 'Hiduš' },
  'greece':       { op: YA + U + NA,                                     translit: 'Yauna' },
  'greek':        { op: YA + U + NA,                                     translit: 'Yauna' },
  'ionia':        { op: YA + U + NA,                                     translit: 'Yauna' },
  'ionian':       { op: YA + U + NA,                                     translit: 'Yauna' },
  'elam':         { op: U + VA + JA,                                     translit: 'Ūvja' },
  'parthia':      { op: PA + RA + THA + VA,                              translit: 'Parθava' },
  'bactria':      { op: BA + A + XA + TA + RA + I + SHA,                 translit: 'Bāxtriš' },
  'arabia':       { op: A + RA + BA + A + YA,                            translit: 'Arabāya' },
  'lydia':        { op: SA + PA + RA + DA,                               translit: 'Sparda' },
  'sardis':       { op: SA + PA + RA + DA,                               translit: 'Sparda' },
  'armenia':      { op: A + RA + MI + I + NA,                            translit: 'Armina' },
  'scythia':      { op: SA + KA + A,                                     translit: 'Sakā' },
  'scythian':     { op: SA + KA + A,                                     translit: 'Sakā' },
  'saka':         { op: SA + KA + A,                                     translit: 'Sakā' },
  'sogdia':       { op: SA + U + GU + U + DA,                            translit: 'Suguda' },
  'sogdiana':     { op: SA + U + GU + U + DA,                            translit: 'Suguda' },
  'cappadocia':   { op: KA + TA + PA + TU + U + KA,                      translit: 'Katpatuka' },
  'gandhara':     { op: GA + DA + A + RA,                                translit: 'Gadāra' },
  'arachosia':    { op: HA + RA + U + VA + TA + I + SHA,                 translit: 'Harauvatiš' },
  'drangiana':    { op: ZA + RA + KA,                                    translit: 'Zranka' },
  'margiana':     { op: MA + RA + GU + U + SHA,                          translit: 'Marguš' },
  'aria':         { op: HA + RA + I + VA,                                translit: 'Haraiva' },
  'chorasmia':    { op: U + VA + A + RA + ZA + MI + I + YA,              translit: 'Uvārazmiya' },
  'libya':        { op: PA + U + TA + A + YA,                            translit: 'Putāyā' },
  'libyan':       { op: PA + U + TA + A + YA,                            translit: 'Putāyā' },
  'nubia':        { op: KU + U + SHA + I + YA,                           translit: 'Kušiya' },
  'ethiopia':     { op: KU + U + SHA + I + YA,                           translit: 'Kušiya' },
  'cush':         { op: KU + U + SHA + I + YA,                           translit: 'Kušiya' },
  'thrace':       { op: SA + KU + U + DA + RA,                           translit: 'Skudra' },
  'maka':         { op: MA + KA + A,                                     translit: 'Makā' },
  'pasargadae':   { op: PA + A + I + SHA + I + YA + A + U + VA + A + DA + A,  translit: 'Paišiyāuvādā' },
  'behistun':     { op: BA + GA + A + SA + TA + A + NA,                  translit: 'Bagastāna' },
  'persepolis':   { op: PA + A + RA + SA,                                translit: 'Pārsa' },
  'susa':         { op: SHA + U + SHA + A,                               translit: 'Šūšā' },
  'ecbatana':     { op: HA + GA + MA + TA + A + NA,                      translit: 'Hagmatāna' },

  // ---- Achaemenid kings ----
  'darius':       { op: DA + A + RA + YA + VA + U + SHA,                 translit: 'Dārayavauš' },
  'xerxes':       { op: XA + SHA + YA + A + RA + SHA + A,                translit: 'Xšayāršā' },
  'cyrus':        { op: KU + U + RU + U + SHA,                           translit: 'Kūruš' },
  'cambyses':     { op: KA + BA + U + JI + I + YA,                       translit: 'Kambūjiya' },
  'artaxerxes':   { op: A + RA + TA + XA + SHA + CCA + A,                translit: 'Artaxšaçā' },
  'hystaspes':    { op: VI + I + SHA + TA + A + SA + PA,                 translit: 'Vištāspa' },
  'achaemenes':   { op: HA + XA + A + MA + NA + I + SHA,                 translit: 'Haxāmaniš' },
  'achaemenid':   { op: HA + XA + A + MA + NA + I + SHA + I + YA,        translit: 'Haxāmanišiya' },
  'achaemenian':  { op: HA + XA + A + MA + NA + I + SHA + I + YA,        translit: 'Haxāmanišiya' },
  'gaumata':      { op: GA + U + MA + A + TA,                            translit: 'Gaumāta' },
  'bardiya':      { op: BA + RA + DA + I + YA,                           translit: 'Bardiya' },
  'smerdis':      { op: BA + RA + DA + I + YA,                           translit: 'Bardiya' },
  'intaphernes':  { op: VI + I + NA + DA + FA + RA + NA + A,             translit: 'Vindafarnā' },
  'otanes':       { op: U + TA + A + NA,                                 translit: 'Utāna' },
  'gobryas':      { op: GA + U + BA + RU + U + VA,                       translit: 'Gaubaruva' },

  // ---- Common nouns ----
  'man':       { op: MA + RA + TA + I + YA,                              translit: 'martiya' },
  'men':       { op: MA + RA + TA + I + YA + A,                          translit: 'martiyā' },
  'people':    { op: KA + A + RA,                                        translit: 'kāra' },
  'army':      { op: KA + A + RA,                                        translit: 'kāra' },
  'father':    { op: PA + I + TA + A,                                    translit: 'pitā' },
  'son':       { op: PA + U + CCA,                                       translit: 'puça' },
  'brother':   { op: BA + RA + A + TA + A,                               translit: 'brātā' },
  'family':    { op: TA + U + MA + A,                                    translit: 'taumā' },
  'house':     { op: VI + THA,                                           translit: 'viθ' },
  'palace':    { op: TA + CA + RA,                                       translit: 'taçara' },
  'throne':    { op: GA + A + THA + U,                                   translit: 'gāθu' },
  'country':   { op: LOGO_COUNTRY,                                       translit: 'dahyāuš' },
  'countries': { op: LOGO_COUNTRIES,                                     translit: 'dahyūnām' },
  'land':      { op: LOGO_COUNTRY,                                       translit: 'dahyāuš' },
  'earth':     { op: LOGO_BUMI,                                          translit: 'būmi' },
  'world':     { op: LOGO_BUMI,                                          translit: 'būmi' },
  'sky':       { op: A + SA + MA + A + NA,                               translit: 'asmān' },
  'heaven':    { op: A + SA + MA + A + NA,                               translit: 'asmān' },
  'name':      { op: NA + A + MA,                                        translit: 'nāma' },
  'horse':     { op: A + SA + PA,                                        translit: 'asa' },
  'water':     { op: A + A + PA + I,                                     translit: 'āpi' },
  'sea':       { op: DA + RA + YA,                                       translit: 'draya' },
  'river':     { op: RU + U + TA,                                        translit: 'rauta' },
  'mountain':  { op: KA + U + FA,                                        translit: 'kaufa' },
  'road':      { op: PA + THA + I,                                       translit: 'paθi' },
  'way':       { op: PA + THA + I,                                       translit: 'paθi' },
  'fire':      { op: A + TA + RA,                                        translit: 'ātar' },
  'sun':       { op: THA + U + RA + VA + HA + RA,                        translit: 'θuravahara' },
  'day':       { op: RA + U + CA + HA,                                   translit: 'raucah' },
  'night':     { op: XA + SHA + PA,                                      translit: 'xšap' },
  'year':      { op: THA + RA + DA,                                      translit: 'θarda' },
  'month':     { op: MA + A + HA,                                        translit: 'māh' },
  'gold':      { op: DA + RA + NA + I + YA,                              translit: 'daraniya' },
  'silver':    { op: A + RA + ZA + TA,                                   translit: 'arzata' },
  'wood':      { op: DA + A + RA + U,                                    translit: 'dāru' },
  'stone':     { op: A + SA + A,                                         translit: 'aθa' },
  'truth':     { op: A + RA + TA,                                        translit: 'arta' },
  'right':     { op: A + RA + TA,                                        translit: 'arta' },
  'lie':       { op: DA + RA + U + GA,                                   translit: 'drauga' },
  'falsehood': { op: DA + RA + U + GA,                                   translit: 'drauga' },
  'evil':      { op: DA + U + SHA,                                       translit: 'duš' },
  'good':      { op: NA + I + BA,                                        translit: 'naiba' },
  'happiness': { op: SHA + I + YA + A + TA + I + SHA,                    translit: 'šiyātiš' },
  'peace':     { op: SHA + I + YA + A + TA + I + SHA,                    translit: 'šiyātiš' },

  // ---- Verbs (3rd sg. present indicative or common forms) ----
  'is':        { op: A + SA + TA + I + YA,                               translit: 'astiy' },
  'are':       { op: A + SA + TA + I + YA,                               translit: 'astiy' },
  'am':        { op: A + MI + I + YA,                                    translit: 'amiy' },
  'was':       { op: A + A + HA,                                         translit: 'āha' },
  'were':      { op: A + A + HA,                                         translit: 'āha' },
  'says':      { op: THA + A + TA + I + YA,                              translit: 'θātiy' },
  'say':       { op: THA + A + TA + I + YA,                              translit: 'θātiy' },
  'said':      { op: A + THA + HA,                                       translit: 'aθah' },
  'speaks':    { op: THA + A + TA + I + YA,                              translit: 'θātiy' },
  'made':      { op: A + KU + U + NA + U + SHA,                          translit: 'akunauš' },
  'make':      { op: KU + U + NA + U + TA + I + YA,                      translit: 'kunautiy' },
  'did':       { op: A + KU + U + NA + VA + MA,                          translit: 'akunavam' },
  'do':        { op: KU + U + NA + U + TA + I + YA,                      translit: 'kunautiy' },
  'gave':      { op: A + DA + A,                                         translit: 'adā' },
  'give':      { op: DA + DA + A + TA + I + YA,                          translit: 'dadātiy' },
  'goes':      { op: A + I + TA + I + YA,                                translit: 'aitiy' },
  'go':        { op: A + I + TA + I + YA,                                translit: 'aitiy' },
  'came':      { op: A + A + GA + MA + TA + A,                           translit: 'āgmatā' },
  'come':      { op: A + GA + MA + TA + I + YA,                          translit: 'agmatiy' },
  'sees':      { op: VA + I + NA + A + TA + I + YA,                      translit: 'vaināntiy' },
  'see':       { op: VA + I + NA + A + TA + I + YA,                      translit: 'vaināntiy' },
  'knows':     { op: XA + SHA + NA + A + SA + A + TA + I + YA,           translit: 'xšnāsātiy' },
  'know':      { op: XA + SHA + NA + A + SA + A + TA + I + YA,           translit: 'xšnāsātiy' },
  'built':     { op: A + KU + U + NA + U + SHA,                          translit: 'akunauš' },
  'build':     { op: KU + U + NA + U + TA + I + YA,                      translit: 'kunautiy' },
  'wrote':     { op: NA + I + PA + I + SHA + TA + A,                     translit: 'nipištā' },
  'write':     { op: NA + I + PA + I + SHA + TA + A,                     translit: 'nipištā' },
  'protect':   { op: PA + A + TA + U + VA,                               translit: 'pātuv' },
  'protects':  { op: PA + A + TA + U + VA,                               translit: 'pātuv' },
  'rules':     { op: XA + SHA + A + YA + THA + I + YA,                   translit: 'xšāyaθiy' },
  'rule':      { op: XA + SHA + A + YA + THA + I + YA,                   translit: 'xšāyaθiy' },
  'aid':       { op: U + PA + SA + TA + A,                               translit: 'upastā' },
  'help':      { op: U + PA + SA + TA + A,                               translit: 'upastā' },
  'bore':      { op: A + BA + RA,                                        translit: 'abara' },
  'bear':      { op: BA + RA + TA + I + YA,                              translit: 'baratiy' },
  'bestowed':  { op: FA + RA + A + BA + RA,                              translit: 'frābara' },
  'bestow':    { op: FA + RA + A + BA + RA + TA + I + YA,                translit: 'frābaratiy' },
  'sent':      { op: A + FA + RA + A + I + SHA + YA + MA,                translit: 'frāišayam' },
  'send':      { op: FA + RA + A + I + SHA + YA + MA + I + YA,           translit: 'frāišayāmiy' },
  'commanded': { op: NA + I + YA + SHA + TA + A + YA + MA,               translit: 'niyaštāyam' },
  'order':     { op: FA + RA + A + MA + A + YA + A + TA + A,             translit: 'frāmāyatā' },
  'smote':     { op: A + JA + NA + MA,                                   translit: 'ajanam' },
  'smite':     { op: JA + A + NA + TA + I + YA,                          translit: 'jantiy' },
  'kill':      { op: JA + A + NA + TA + I + YA,                          translit: 'jantiy' },
  'killed':    { op: A + JA + NA + MA,                                   translit: 'ajanam' },
  'seized':    { op: A + GA + RA + BA + A + YA + MA,                     translit: 'agrabāyam' },
  'fled':      { op: A + MU + U + THA,                                   translit: 'amūθa' },
  'fought':    { op: HA + MA + RA + NA + MA,                             translit: 'hamarana' },
  'battle':    { op: HA + MA + RA + NA + MA,                             translit: 'hamarana' },
  'rebel':     { op: HA + MI + I + CCA + I + YA,                         translit: 'hamiçiya' },
  'rebellion': { op: HA + MI + I + CCA + I + YA,                         translit: 'hamiçiya' },
  'revolt':    { op: HA + MI + I + CCA + I + YA,                         translit: 'hamiçiya' },
  'death':     { op: MA + RA + SHA + I + YA + U,                         translit: 'maršiyu' },
  'die':       { op: MA + RA + SHA + I + YA + U,                         translit: 'maršiyu' },
  'died':      { op: A + MA + RA + I + YA + TA + A,                      translit: 'amariyatā' },

  // ---- Particles / conjunctions / prepositions ----
  'and':       { op: U + TA + A,                                         translit: 'utā' },
  'also':      { op: U + TA + A,                                         translit: 'utā' },
  'with':      { op: HA + DA + A,                                        translit: 'hadā' },
  'from':      { op: HA + CA + A,                                        translit: 'hacā' },
  'in':        { op: A + NA + TA + RA,                                   translit: 'antar' },
  'into':      { op: A + NA + TA + RA,                                   translit: 'antar' },
  'on':        { op: A + DA + I,                                         translit: 'adi' },
  'upon':      { op: A + DA + I,                                         translit: 'adi' },
  'after':     { op: PA + SA + A + VA,                                   translit: 'pasāva' },
  'then':      { op: PA + SA + A + VA,                                   translit: 'pasāva' },
  'when':      { op: YA + DA + A,                                        translit: 'yadā' },
  'where':     { op: YA + DA + A + YA + A,                               translit: 'yadāyā' },
  'not':       { op: NA + I + YA,                                        translit: 'naiy' },
  'no':        { op: NA + I + YA,                                        translit: 'naiy' },
  'if':        { op: YA + DA + I + YA,                                   translit: 'yadiy' },
  'because':   { op: A + VA + HA + YA + RA + A + DA + I + YA,            translit: 'avahyarādiy' },
  'much':      { op: VA + SA + I + YA,                                   translit: 'vasaiy' },
  'many':      { op: VA + SA + I + YA,                                   translit: 'vasaiy' },
  'all':       { op: VI + SA + PA,                                       translit: 'visa' },
  'every':     { op: VI + SA + PA,                                       translit: 'visa' },
  'one':       { op: A + I + VA,                                         translit: 'aiva' },
  'other':     { op: A + NA + I + YA,                                    translit: 'aniya' },
  'first':     { op: PA + RA + U + VA,                                   translit: 'paruva' },
  'before':    { op: PA + RA + U + VA + I + YA,                          translit: 'paruviya' },
  'far':       { op: DA + U + RA + I + YA,                               translit: 'dūraiy' },
  'long':      { op: DA + A + RA + GA,                                   translit: 'darga' },
  'true':      { op: HA + SHA + I + YA,                                  translit: 'hašiya' },
  'wise':      { op: HA + U + ZA + A + NA + I + YA,                      translit: 'huzānaiy' },

  // ---- Inscription formulas, titles, and military terms ----
  'spear':      { op: A + RA + SHA + TA + I,                             translit: 'aršti' },
  'bow':        { op: THA + A + NA + VA + RA,                            translit: 'θanvar' },
  'arrow':      { op: TA + I + GA + RA + A,                              translit: 'tigrā' },
  'shield':     { op: SA + PA + RA,                                      translit: 'spar' },
  'gate':       { op: DU + VA + RA + THA + I,                            translit: 'duvarθī' },
  'door':       { op: DU + VA + RA + THA + I,                            translit: 'duvarθī' },
  'column':     { op: SA + TU + U + NA + A,                              translit: 'stūnā' },
  'pillar':     { op: SA + TU + U + NA + A,                              translit: 'stūnā' },
  'inscription':{ op: DI + I + PA + I,                                   translit: 'dipī' },
  'writing':    { op: DI + I + PA + I,                                   translit: 'dipī' },
  'scribe':     { op: DI + I + PA + I + VA + RA,                         translit: 'dipīvara' },
  'tribute':    { op: BA + A + JI + I,                                   translit: 'bāji' },
  'tax':        { op: BA + A + JI + I,                                   translit: 'bāji' },
  'law':        { op: DA + A + TA,                                       translit: 'dāta' },
  'judge':      { op: DA + A + TA + BA + RA,                             translit: 'dātabara' },
  'satrap':     { op: XA + SHA + A + CCA + PA + A + VA + A,              translit: 'xšaçapāvā' },
  'satrapy':    { op: XA + SHA + A + CCA + PA + A + VA + A + NA + A,     translit: 'xšaçapāvanā' },
  'enemy':      { op: HA + I + NA + A,                                   translit: 'hainā' },
  'friend':     { op: DA + U + SHA + TA + A,                             translit: 'dauštā' },
  'beloved':    { op: FA + RA + I + YA,                                  translit: 'friya' },

  // ---- "By the favor of" formula & frequent particles ----
  'favor':      { op: VA + SHA + NA + A,                                 translit: 'vašnā' },
  'favour':     { op: VA + SHA + NA + A,                                 translit: 'vašnā' },
  'time':       { op: ZA + RA + VA + NA,                                 translit: 'zruvan' },
  'forever':    { op: YA + A + VA + A,                                   translit: 'yāvā' },
  'always':     { op: YA + A + VA + A,                                   translit: 'yāvā' },

  // ---- Greetings & common phrases (composed) ----
  'hello':     { op: SHA + I + YA + A + TA + I + SHA,                    translit: 'šiyātiš' }, // 'happiness/peace'
  'greetings': { op: SHA + I + YA + A + TA + I + SHA,                    translit: 'šiyātiš' },
};

// === NUMBER CONVERSION ===
// Old Persian numerals are additive (like Roman numerals):
//   1, 2, 10, 20, 100 are the base signs; numbers compose by addition, larger first.
function numberToCuneiform(n) {
  if (n < 0 || !Number.isFinite(n)) return String(n);
  if (n === 0) return ''; // Old Persian had no zero sign
  let s = '';
  let rem = Math.floor(n);

  // hundreds
  while (rem >= 100) { s += N100; rem -= 100; }
  // twenties
  while (rem >= 20)  { s += N20;  rem -= 20;  }
  // tens
  while (rem >= 10)  { s += N10;  rem -= 10;  }
  // twos
  while (rem >= 2)   { s += N2;   rem -= 2;   }
  // ones
  while (rem >= 1)   { s += N1;   rem -= 1;   }

  return s;
}

// === PHONETIC TRANSLITERATION (fallback for unknown words) ===
// Maps an English-spelled word to Old Persian syllabary by approximating phonemes.
// Old Persian is a CV (consonant + vowel) syllabary with special signs for some
// consonant-vowel combinations (di/ji/mi/vi for i; ku/gu/tu/du/nu/mu/ru for u).

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

// English vowel/letter -> Old Persian vowel category (a / i / u)
function vowelCategory(ch) {
  switch (ch) {
    case 'a': return 'a';
    case 'e': return 'i'; // English 'e' usually maps to /i/ or /e/
    case 'i': return 'i';
    case 'o': return 'u'; // English 'o' approximates to /o/~/u/
    case 'u': return 'u';
    case 'y': return 'i';
    default:  return null;
  }
}

// Get the syllable sign for a consonant + vowel-category.
// Falls back to Ca + V if no dedicated CV sign exists.
function syllable(consonant, vcat) {
  const VOWEL_SIGN = { a: '', i: I, u: U };
  const map = {
    'k':  { a: KA, i: KA + I, u: KU },
    'g':  { a: GA, i: GA + I, u: GU },
    'x':  { a: XA, i: XA + I, u: XA + U },     // kh
    'c':  { a: CA, i: CA + I, u: CA + U },     // ch
    'j':  { a: JA, i: JI,     u: JA + U },
    't':  { a: TA, i: TA + I, u: TU },
    'd':  { a: DA, i: DI,     u: DU },
    'q':  { a: THA, i: THA + I, u: THA + U },  // th
    'p':  { a: PA, i: PA + I, u: PA + U },
    'b':  { a: BA, i: BA + I, u: BA + U },
    'f':  { a: FA, i: FA + I, u: FA + U },
    'n':  { a: NA, i: NA + I, u: NU },
    'm':  { a: MA, i: MI,     u: MU },
    'y':  { a: YA, i: YA + I, u: YA + U },
    'v':  { a: VA, i: VI,     u: VA + U },
    'w':  { a: VA, i: VI,     u: VA + U },     // w → v (closest)
    'r':  { a: RA, i: RA + I, u: RU },
    'l':  { a: LA, i: LA + I, u: LA + U },
    's':  { a: SA, i: SA + I, u: SA + U },
    'z':  { a: ZA, i: ZA + I, u: ZA + U },
    'h':  { a: HA, i: HA + I, u: HA + U },
  };
  if (map[consonant]) return map[consonant][vcat];
  // Unknown letter — skip silently
  return '';
}

// Pre-process English to handle digraphs by replacing them with single ASCII placeholders
// 'q' is repurposed to mean 'th' (θ), since real English 'q' is rare and usually 'qu'='kw'.
function normalizeEnglish(word) {
  let w = word.toLowerCase();

  // Silent / odd combinations first
  w = w.replace(/^kn/g, 'n');    // knight, knee
  w = w.replace(/^wr/g, 'r');    // write, wrong
  w = w.replace(/^ps/g, 's');    // psalm
  w = w.replace(/^gn/g, 'n');    // gnome
  w = w.replace(/mb$/g, 'm');    // lamb, comb
  w = w.replace(/gh/g, '');      // night → nit, light → lit
  w = w.replace(/ck/g, 'k');     // back → bak
  w = w.replace(/qu/g, 'kv');    // queen → kven
  w = w.replace(/x/g, 'ks');     // ax → aks (then 'x' digraph handled below if not consumed)
  w = w.replace(/ph/g, 'f');     // phone → fone
  w = w.replace(/sh/g, 'Š');     // marker for SHA
  w = w.replace(/ch/g, 'Č');     // marker for CA
  w = w.replace(/th/g, 'q');     // marker for THA (reuses 'q' slot)
  w = w.replace(/kh/g, 'X');     // marker for XA
  w = w.replace(/tz|ts/g, 'Ç');  // marker for CCA (ç)
  w = w.replace(/ng/g, 'Ŋ');     // marker for n + g (nasal)
  // Double consonants collapse (Old Persian doesn't double)
  w = w.replace(/([bcdfghjklmnpqrstvwxz])\1/g, '$1');
  // Trailing silent 'e' (cake, name)
  w = w.replace(/e$/g, '');
  return w;
}

function transliterate(word) {
  const w = normalizeEnglish(word);
  if (!w) return '';
  let out = '';
  let i = 0;

  while (i < w.length) {
    const ch = w[i];
    const next = w[i + 1];

    // Handle digraph markers
    if (ch === 'Š' || ch === 'Č' || ch === 'X' || ch === 'Ç' || ch === 'Ŋ') {
      const vcat = next && vowelCategory(next);
      const v = vcat || 'a';
      const VOWEL_SIGN = { a: '', i: I, u: U };
      let base;
      switch (ch) {
        case 'Š': base = SHA; break;
        case 'Č': base = CA;  break;
        case 'X': base = XA;  break;
        case 'Ç': base = CCA; break;
        case 'Ŋ': base = NA;  break;
      }
      out += base + (v !== 'a' ? VOWEL_SIGN[v] : '');
      if (ch === 'Ŋ') out += GA; // ng → n + g(a)
      i += vcat ? 2 : 1;
      continue;
    }

    // Pure vowel
    if (VOWELS.has(ch)) {
      // Skip if it's the second part of a CV we already handled — but in this loop
      // a vowel at the head is a true initial/standalone vowel.
      const cat = vowelCategory(ch);
      out += cat === 'a' ? A : cat === 'i' ? I : U;
      i++;
      // Collapse subsequent identical vowels (long-vowel approximation): aa → ā written as one A
      while (i < w.length && vowelCategory(w[i]) === cat) i++;
      continue;
    }

    // Consonant
    if (next && VOWELS.has(next)) {
      const cat = vowelCategory(next);
      out += syllable(ch, cat);
      i += 2;
      // Skip extra repeated vowels (long vowels are not separately encoded here)
      while (i < w.length && vowelCategory(w[i]) === cat) i++;
    } else {
      // Final or pre-consonantal: write Ca (inherent 'a' is silent)
      out += syllable(ch, 'a');
      i++;
    }
  }
  return out;
}

// Old Persian had no articles, and used case endings instead of standalone
// prepositions like English "of" / "to" / "for". Drop these silently rather
// than mangle them with phonetic transliteration.
const SKIP_WORDS = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'by']);

// === MAIN TRANSLATION FUNCTION ===
function translateToCuneiform(text) {
  if (!text || !text.trim()) {
    return { cuneiform: '', translit: '' };
  }

  const tokens = text.match(/[A-Za-z']+|\d+|[.,!?;:]/g) || [];
  const cuneiformParts = [];
  const translitParts = [];

  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      const n = parseInt(tok, 10);
      const c = numberToCuneiform(n);
      if (c) {
        cuneiformParts.push(c);
        translitParts.push(String(n));
      }
    } else if (/^[.,!?;:]$/.test(tok)) {
      // Old Persian punctuation was just the word divider; skip — divider is added between words.
      continue;
    } else {
      const lower = tok.toLowerCase().replace(/'/g, '');
      if (SKIP_WORDS.has(lower)) continue;
      const entry = DICTIONARY[lower];
      if (entry) {
        cuneiformParts.push(entry.op);
        translitParts.push(entry.translit);
      } else {
        const c = transliterate(lower);
        if (c) {
          cuneiformParts.push(c);
          translitParts.push(romanize(lower));
        }
      }
    }
  }

  const cuneiform = cuneiformParts.filter(Boolean).join(DIV);
  const translit  = translitParts.filter(Boolean).join(' · ');
  return { cuneiform, translit };
}

// Produce a rough Latin transliteration of a transliterated word (for the user reference line).
function romanize(word) {
  const w = normalizeEnglish(word);
  return w
    .replace(/Š/g, 'š')
    .replace(/Č/g, 'c')
    .replace(/X/g, 'x')
    .replace(/Ç/g, 'ç')
    .replace(/Ŋ/g, 'ng')
    .replace(/q/g, 'θ');
}

// === REVERSE TRANSLATION: CUNEIFORM -> ENGLISH ===
// Built once from the forward DICTIONARY. The first-seen English form wins
// when multiple English words map to the same Old Persian spelling, so the
// dictionary's natural ordering (canonical form before inflections) controls
// what we pick. e.g. 'persia' is seen before 'persian', so 𐎱𐎠𐎼𐎿 → "persia".
const REVERSE_DICT = (() => {
  const m = new Map();
  for (const eng of Object.keys(DICTIONARY)) {
    const entry = DICTIONARY[eng];
    if (!m.has(entry.op)) m.set(entry.op, { english: eng, translit: entry.translit });
  }
  return m;
})();

// Each phonetic sign mapped to its Latin syllable. Used for romanizing
// cuneiform words that aren't in the dictionary and need a phonetic
// fallback rendering.
const SIGN_TO_LATIN = {
  [A]:  'a',   [I]:  'i',   [U]:  'u',
  [KA]: 'ka',  [KU]: 'ku',  [GA]: 'ga',  [GU]: 'gu',
  [XA]: 'xa',  [CA]: 'ca',  [JA]: 'ja',  [JI]: 'ji',
  [TA]: 'ta',  [TU]: 'tu',  [DA]: 'da',  [DI]: 'di',  [DU]: 'du',
  [THA]:'θa',  [PA]: 'pa',  [BA]: 'ba',  [FA]: 'fa',
  [NA]: 'na',  [NU]: 'nu',  [MA]: 'ma',  [MI]: 'mi',  [MU]: 'mu',
  [YA]: 'ya',  [VA]: 'va',  [VI]: 'vi',
  [RA]: 'ra',  [RU]: 'ru',  [LA]: 'la',
  [SA]: 'sa',  [ZA]: 'za',  [SHA]:'ša',  [CCA]:'ça',  [HA]: 'ha',
};

// Plain-English glosses for the eight logograms.
const LOGO_GLOSS = {
  [LOGO_AURAMAZDA]:   { english: 'Auramazda',     translit: 'Auramazdā' },
  [LOGO_AURAMAZDA2]:  { english: 'Auramazda',     translit: 'Auramazdā' },
  [LOGO_AURAMAZDAHA]: { english: 'of Auramazda',  translit: 'Auramazdāha' },
  [LOGO_KING]:        { english: 'king',          translit: 'xšāyaθiya' },
  [LOGO_COUNTRY]:     { english: 'country',       translit: 'dahyāuš' },
  [LOGO_COUNTRIES]:   { english: 'countries',     translit: 'dahyūnām' },
  [LOGO_BAGA]:        { english: 'god',           translit: 'baga' },
  [LOGO_BUMI]:        { english: 'earth',         translit: 'būmi' },
};

// Numeral values for additive reconstruction.
const NUM_VAL = { [N1]: 1, [N2]: 2, [N10]: 10, [N20]: 20, [N100]: 100 };

// Strip diacritics from a transliteration so the English-side output reads
// cleanly. "Dārayavauš" → "darayavaush", "θātiy" → "thatiy".
function stripDiacritics(s) {
  return s
    .replace(/[āĀ]/g, 'a').replace(/[īĪ]/g, 'i').replace(/[ūŪ]/g, 'u')
    .replace(/[ēĒ]/g, 'e').replace(/[ōŌ]/g, 'o')
    .replace(/[θ]/g, 'th').replace(/[ð]/g, 'd')
    .replace(/[š]/g, 'sh').replace(/[ž]/g, 'zh')
    .replace(/[ç]/g, 'ts').replace(/[ḫ]/g, 'kh');
}

// Romanize an unknown cuneiform word by concatenating its sign-syllables,
// then collapsing the obvious doubled-vowel sequences that Old Persian
// orthography uses for long vowels: Ca + a → Cā, Ci + i → Cī, Cu + u → Cū.
function romanizeCuneWord(chars) {
  let s = '';
  for (const c of chars) {
    if (SIGN_TO_LATIN[c]) s += SIGN_TO_LATIN[c];
    else if (LOGO_GLOSS[c]) s += LOGO_GLOSS[c].translit;
    else if (NUM_VAL[c]) s += String(NUM_VAL[c]);
    // unknown sign: skip silently rather than insert noise
  }
  return s
    .replace(/aa/g, 'ā')
    .replace(/ii/g, 'ī')
    .replace(/uu/g, 'ū');
}

function translateToEnglish(text) {
  if (!text || !text.trim()) return { english: '', translit: '' };

  // Tokenize: split on the Old Persian word divider AND any whitespace.
  // Anything that isn't a cuneiform glyph, divider, or whitespace becomes
  // its own token (so users can mix in punctuation or stray characters
  // without breaking the split).
  const tokens = [];
  let buf = '';
  for (const ch of Array.from(text)) {
    if (ch === DIV || /\s/.test(ch)) {
      if (buf) { tokens.push(buf); buf = ''; }
    } else {
      buf += ch;
    }
  }
  if (buf) tokens.push(buf);

  const englishParts = [];
  const translitParts = [];

  for (const tok of tokens) {
    const chars = Array.from(tok);

    // Pure numeral cluster: sum the values.
    if (chars.length && chars.every(c => NUM_VAL[c] !== undefined)) {
      const sum = chars.reduce((s, c) => s + NUM_VAL[c], 0);
      englishParts.push(String(sum));
      translitParts.push(String(sum));
      continue;
    }

    // Dictionary hit — exact match on the full token.
    if (REVERSE_DICT.has(tok)) {
      const { english, translit } = REVERSE_DICT.get(tok);
      englishParts.push(english);
      translitParts.push(translit);
      continue;
    }

    // Single-glyph logogram.
    if (chars.length === 1 && LOGO_GLOSS[chars[0]]) {
      const { english, translit } = LOGO_GLOSS[chars[0]];
      englishParts.push(english);
      translitParts.push(translit);
      continue;
    }

    // Phonetic fallback: romanize the syllables. The "English" side gets
    // a diacritic-stripped, ASCII-friendly form; the translit line keeps
    // the scholarly diacritics so the user can compare against published
    // editions.
    const rom = romanizeCuneWord(chars);
    if (rom) {
      englishParts.push(stripDiacritics(rom));
      translitParts.push(rom);
    }
  }

  return {
    english: englishParts.join(' '),
    translit: translitParts.join(' · '),
  };
}

// Expose to the global scope for script.js
window.translateToCuneiform = translateToCuneiform;
window.translateToEnglish   = translateToEnglish;
