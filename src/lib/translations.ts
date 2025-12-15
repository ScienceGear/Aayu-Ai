export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';

export const languages = [
  { value: 'en' as Language, label: 'English', nativeLabel: 'English' },
  { value: 'hi' as Language, label: 'Hindi', nativeLabel: 'हिंदी' },
  { value: 'ta' as Language, label: 'Tamil', nativeLabel: 'தமிழ்' },
  { value: 'te' as Language, label: 'Telugu', nativeLabel: 'తెలుగు' },
  { value: 'bn' as Language, label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'mr' as Language, label: 'Marathi', nativeLabel: 'मराठी' },
  { value: 'gu' as Language, label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { value: 'kn' as Language, label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { value: 'ml' as Language, label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { value: 'pa' as Language, label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { value: 'or' as Language, label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { value: 'as' as Language, label: 'Assamese', nativeLabel: 'অসমীয়া' },
];

type TranslationKeys = {
  // Common
  appName: string;
  welcome: string;
  settings: string;
  save: string;
  cancel: string;
  back: string;
  next: string;
  continue: string;
  loading: string;

  // Navigation
  dashboard: string;
  assistant: string;
  medicines: string;
  exercise: string;
  garden: string;
  caregivers: string;
  emergency: string;
  reports: string;

  // Settings
  accessibility: string;
  textSize: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;
  notifications: string;
  voicePreference: string;

  // Caregivers
  myCaregivers: string;
  assignedCaregivers: string;
  noCaregivers: string;
  contactCaregiver: string;
  callCaregiver: string;
  videoCall: string;
  chat: string;
  lastSeen: string;
  online: string;
  offline: string;

  // Auth
  login: string;
  signup: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  selectLanguage: string;
  selectTextSize: string;
  createAccount: string;
  alreadyHaveAccount: string;

  // Dashboard
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  howAreYou: string;
  nextMedicine: string;
  waterIntake: string;
  todayActivity: string;

  // Emergency
  sosButton: string;
  emergencyContacts: string;
  callEmergency: string;

  // New Dashboard Keys
  welcomeBack: string;
  healthSummary: string;
  activeAlerts: string;
  assignedElders: string;
  recentReports: string;
  totalElders: string;
  pendingApprovals: string;
  manageCaregivers: string;

  // Navigation & Layout
  virtualGarden: string;
  healthReports: string;
  sosAlerts: string;
  messages: string;
  myAccount: string;
  logout: string;
  caregiverPortal: string;
  orgAdmin: string;
  startVideoCall: string;
};

const translations: Record<Language, any> = {
  en: {
    appName: 'Aayu AI',
    welcome: 'Welcome',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    continue: 'Continue',
    loading: 'Loading...',

    dashboard: 'Dashboard',
    assistant: 'Aayu Assistant',
    medicines: 'Medicines',
    exercise: 'Exercise',
    garden: 'Garden',
    caregivers: 'Caregivers',
    emergency: 'Emergency',
    reports: 'Reports',

    accessibility: 'Accessibility',
    textSize: 'Text Size',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    notifications: 'Notifications',
    voicePreference: 'Voice Preference',

    myCaregivers: 'My Caregivers',
    assignedCaregivers: 'Your Assigned Caregivers',
    noCaregivers: 'No caregivers assigned yet',
    contactCaregiver: 'Contact',
    callCaregiver: 'Voice Call',
    videoCall: 'Video Call',
    chat: 'Chat',
    lastSeen: 'Last seen',
    online: 'Online',
    offline: 'Offline',

    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    selectLanguage: 'Select Your Language',
    selectTextSize: 'Choose Text Size',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',

    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    howAreYou: 'How are you feeling today?',
    nextMedicine: 'Next Medicine',
    waterIntake: 'Water Intake',
    todayActivity: "Today's Activity",

    sosButton: 'SOS Emergency',
    emergencyContacts: 'Emergency Contacts',
    callEmergency: 'Call Emergency',

    welcomeBack: 'Welcome back',
    healthSummary: 'Health Summary',
    activeAlerts: 'Active Alerts',
    assignedElders: 'Assigned Elders',
    recentReports: 'Recent Reports',
    totalElders: 'Total Elders',
    pendingApprovals: 'Pending Approvals',
    manageCaregivers: 'Manage Caregivers',

    virtualGarden: 'Virtual Garden',
    healthReports: 'Health Reports',
    sosAlerts: 'SOS Alerts',
    messages: 'Messages',
    myAccount: 'My Account',
    logout: 'Logout',
    caregiverPortal: 'Caregiver Portal',
    orgAdmin: 'Org Admin',
    startVideoCall: 'Start Video Call',
  },
  hi: {
    appName: 'आयु AI',
    welcome: 'स्वागत है',
    settings: 'सेटिंग्स',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    back: 'वापस',
    next: 'अगला',
    continue: 'जारी रखें',
    loading: 'लोड हो रहा है...',

    dashboard: 'डैशबोर्ड',
    assistant: 'आयु सहायक',
    medicines: 'दवाइयाँ',
    exercise: 'व्यायाम',
    garden: 'बगीचा',
    caregivers: 'देखभालकर्ता',
    emergency: 'आपातकाल',
    reports: 'रिपोर्ट',

    accessibility: 'सुगम्यता',
    textSize: 'टेक्स्ट का आकार',
    language: 'भाषा',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    notifications: 'सूचनाएँ',
    voicePreference: 'आवाज़ की पसंद',

    myCaregivers: 'मेरे देखभालकर्ता',
    assignedCaregivers: 'आपके नियुक्त देखभालकर्ता',
    noCaregivers: 'अभी कोई देखभालकर्ता नहीं',
    contactCaregiver: 'संपर्क करें',
    callCaregiver: 'वॉयस कॉल',
    videoCall: 'वीडियो कॉल',
    chat: 'चैट',
    lastSeen: 'आखिरी बार देखा',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',

    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    phoneNumber: 'फ़ोन नंबर',
    selectLanguage: 'अपनी भाषा चुनें',
    selectTextSize: 'टेक्स्ट का आकार चुनें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',

    goodMorning: 'सुप्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    howAreYou: 'आज आप कैसा महसूस कर रहे हैं?',
    nextMedicine: 'अगली दवा',
    waterIntake: 'पानी पीना',
    todayActivity: 'आज की गतिविधि',

    sosButton: 'SOS आपातकाल',
    emergencyContacts: 'आपातकालीन संपर्क',
    callEmergency: 'आपातकालीन कॉल',

    welcomeBack: 'वापसी पर स्वागत है',
    healthSummary: 'स्वास्थ्य सारांश',
    activeAlerts: 'सक्रिय अलर्ट',
    assignedElders: 'नियुक्त बुजुर्ग',
    recentReports: 'हाल की रिपोर्ट',
    totalElders: 'कुल बुजुर्ग',
    pendingApprovals: 'लंबित स्वीकृतियां',
    manageCaregivers: 'देखभालकर्ताओं का प्रबंधन करें',

    virtualGarden: 'आभासी उद्यान',
    healthReports: 'स्वास्थ्य रिपोर्ट',
    sosAlerts: 'SOS अलर्ट',
    messages: 'संदेश',
    myAccount: 'मेरा खाता',
    logout: 'लॉग आउट',
    caregiverPortal: 'देखभालकर्ता पोर्टल',
    orgAdmin: 'संगठन व्यवस्थापक',
    startVideoCall: 'वीडियो कॉल शुरू करें',
  },
  ta: {
    appName: 'ஆயு AI',
    welcome: 'வரவேற்கிறோம்',
    settings: 'அமைப்புகள்',
    save: 'சேமி',
    cancel: 'ரத்து',
    back: 'பின்',
    next: 'அடுத்து',
    continue: 'தொடரவும்',
    loading: 'ஏற்றுகிறது...',

    dashboard: 'டாஷ்போர்ட்',
    assistant: 'ஆயு உதவியாளர்',
    medicines: 'மருந்துகள்',
    exercise: 'உடற்பயிற்சி',
    garden: 'தோட்டம்',
    caregivers: 'பராமரிப்பாளர்கள்',
    emergency: 'அவசரநிலை',
    reports: 'அறிக்கைகள்',

    accessibility: 'அணுகல்தன்மை',
    textSize: 'எழுத்து அளவு',
    language: 'மொழி',
    theme: 'தீம்',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
    notifications: 'அறிவிப்புகள்',
    voicePreference: 'குரல் விருப்பம்',

    myCaregivers: 'என் பராமரிப்பாளர்கள்',
    assignedCaregivers: 'உங்கள் ஒதுக்கப்பட்ட பராமரிப்பாளர்கள்',
    noCaregivers: 'இன்னும் பராமரிப்பாளர்கள் இல்லை',
    contactCaregiver: 'தொடர்பு',
    callCaregiver: 'குரல் அழைப்பு',
    videoCall: 'வீடியோ அழைப்பு',
    chat: 'சாட்',
    lastSeen: 'கடைசியாக பார்த்தது',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன்',

    login: 'உள்நுழைய',
    signup: 'பதிவு செய்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    fullName: 'முழு பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    selectTextSize: 'எழுத்து அளவைத் தேர்வுசெய்க',
    createAccount: 'கணக்கை உருவாக்கு',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',

    goodMorning: 'காலை வணக்கம்',
    goodAfternoon: 'மதிய வணக்கம்',
    goodEvening: 'மாலை வணக்கம்',
    howAreYou: 'இன்று எப்படி உணர்கிறீர்கள்?',
    nextMedicine: 'அடுத்த மருந்து',
    waterIntake: 'தண்ணீர் உட்கொள்ளல்',
    todayActivity: 'இன்றைய செயல்பாடு',

    sosButton: 'SOS அவசரநிலை',
    emergencyContacts: 'அவசர தொடர்புகள்',
    callEmergency: 'அவசர அழைப்பு',
  },
  te: {
    appName: 'ఆయు AI',
    welcome: 'స్వాగతం',
    settings: 'సెట్టింగ్‌లు',
    save: 'సేవ్',
    cancel: 'రద్దు',
    back: 'వెనక్కి',
    next: 'తదుపరి',
    continue: 'కొనసాగించు',
    loading: 'లోడ్ అవుతోంది...',

    dashboard: 'డాష్‌బోర్డ్',
    assistant: 'ఆయు అసిస్టెంట్',
    medicines: 'మందులు',
    exercise: 'వ్యాయామం',
    garden: 'తోట',
    caregivers: 'సంరక్షకులు',
    emergency: 'అత్యవసర పరిస్థితి',
    reports: 'నివేదికలు',

    accessibility: 'యాక్సెసిబిలిటీ',
    textSize: 'టెక్స్ట్ సైజ్',
    language: 'భాష',
    theme: 'థీమ్',
    darkMode: 'డార్క్ మోడ్',
    lightMode: 'లైట్ మోడ్',
    notifications: 'నోటిఫికేషన్లు',
    voicePreference: 'వాయిస్ ప్రాధాన్యత',

    myCaregivers: 'నా సంరక్షకులు',
    assignedCaregivers: 'మీ నియమిత సంరక్షకులు',
    noCaregivers: 'ఇంకా సంరక్షకులు లేరు',
    contactCaregiver: 'సంప్రదించండి',
    callCaregiver: 'వాయిస్ కాల్',
    videoCall: 'వీడియో కాల్',
    chat: 'చాట్',
    lastSeen: 'చివరిసారి చూసింది',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',

    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    fullName: 'పూర్తి పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    selectTextSize: 'టెక్స్ట్ సైజ్ ఎంచుకోండి',
    createAccount: 'ఖాతా సృష్టించండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',

    goodMorning: 'శుభోదయం',
    goodAfternoon: 'శుభ మధ్యాహ్నం',
    goodEvening: 'శుభ సాయంత్రం',
    howAreYou: 'మీరు ఈరోజు ఎలా అనుభవిస్తున్నారు?',
    nextMedicine: 'తదుపరి మందు',
    waterIntake: 'నీటి తీసుకోవడం',
    todayActivity: 'ఈరోజు కార్యకలాపం',

    sosButton: 'SOS అత్యవసరం',
    emergencyContacts: 'అత్యవసర సంప్రదింపులు',
    callEmergency: 'అత్యవసర కాల్',
  },
  bn: {
    appName: 'আয়ু AI',
    welcome: 'স্বাগতম',
    settings: 'সেটিংস',
    save: 'সেভ',
    cancel: 'বাতিল',
    back: 'পিছনে',
    next: 'পরবর্তী',
    continue: 'চালিয়ে যান',
    loading: 'লোড হচ্ছে...',

    dashboard: 'ড্যাশবোর্ড',
    assistant: 'আয়ু সহকারী',
    medicines: 'ওষুধ',
    exercise: 'ব্যায়াম',
    garden: 'বাগান',
    caregivers: 'যত্নকারী',
    emergency: 'জরুরি অবস্থা',
    reports: 'রিপোর্ট',

    accessibility: 'অ্যাক্সেসিবিলিটি',
    textSize: 'টেক্সট সাইজ',
    language: 'ভাষা',
    theme: 'থিম',
    darkMode: 'ডার্ক মোড',
    lightMode: 'লাইট মোড',
    notifications: 'বিজ্ঞপ্তি',
    voicePreference: 'ভয়েস পছন্দ',

    myCaregivers: 'আমার যত্নকারীরা',
    assignedCaregivers: 'আপনার নিযুক্ত যত্নকারীরা',
    noCaregivers: 'এখনও কোনো যত্নকারী নেই',
    contactCaregiver: 'যোগাযোগ',
    callCaregiver: 'ভয়েস কল',
    videoCall: 'ভিডিও কল',
    chat: 'চ্যাট',
    lastSeen: 'সর্বশেষ দেখা',
    online: 'অনলাইন',
    offline: 'অফলাইন',

    login: 'লগইন',
    signup: 'সাইন আপ',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    fullName: 'পুরো নাম',
    phoneNumber: 'ফোন নম্বর',
    selectLanguage: 'আপনার ভাষা নির্বাচন করুন',
    selectTextSize: 'টেক্সট সাইজ নির্বাচন করুন',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',

    goodMorning: 'সুপ্রভাত',
    goodAfternoon: 'শুভ দুপুর',
    goodEvening: 'শুভ সন্ধ্যা',
    howAreYou: 'আজ আপনি কেমন অনুভব করছেন?',
    nextMedicine: 'পরবর্তী ওষুধ',
    waterIntake: 'জল গ্রহণ',
    todayActivity: 'আজকের কার্যকলাপ',

    sosButton: 'SOS জরুরি',
    emergencyContacts: 'জরুরি যোগাযোগ',
    callEmergency: 'জরুরি কল',
  },
  mr: {
    appName: 'आयु AI',
    welcome: 'स्वागत आहे',
    settings: 'सेटिंग्ज',
    save: 'सेव्ह करा',
    cancel: 'रद्द करा',
    back: 'मागे',
    next: 'पुढे',
    continue: 'सुरू ठेवा',
    loading: 'लोड होत आहे...',

    dashboard: 'डॅशबोर्ड',
    assistant: 'आयु सहाय्यक',
    medicines: 'औषधे',
    exercise: 'व्यायाम',
    garden: 'बाग',
    caregivers: 'काळजीवाहक',
    emergency: 'आणीबाणी',
    reports: 'अहवाल',

    accessibility: 'सुलभता',
    textSize: 'मजकूर आकार',
    language: 'भाषा',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    notifications: 'सूचना',
    voicePreference: 'आवाज प्राधान्य',

    myCaregivers: 'माझे काळजीवाहक',
    assignedCaregivers: 'तुमचे नियुक्त काळजीवाहक',
    noCaregivers: 'अजून काळजीवाहक नाहीत',
    contactCaregiver: 'संपर्क',
    callCaregiver: 'व्हॉइस कॉल',
    videoCall: 'व्हिडिओ कॉल',
    chat: 'चॅट',
    lastSeen: 'शेवटचे पाहिले',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',

    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूर्ण नाव',
    phoneNumber: 'फोन नंबर',
    selectLanguage: 'तुमची भाषा निवडा',
    selectTextSize: 'मजकूर आकार निवडा',
    createAccount: 'खाते तयार करा',
    alreadyHaveAccount: 'आधीच खाते आहे?',

    goodMorning: 'सुप्रभात',
    goodAfternoon: 'शुभ दुपार',
    goodEvening: 'शुभ संध्याकाळ',
    howAreYou: 'आज तुम्हाला कसे वाटते?',
    nextMedicine: 'पुढील औषध',
    waterIntake: 'पाणी सेवन',
    todayActivity: 'आजची क्रिया',

    sosButton: 'SOS आणीबाणी',
    emergencyContacts: 'आणीबाणी संपर्क',
    callEmergency: 'आणीबाणी कॉल',
  },
  gu: {
    appName: 'આયુ AI',
    welcome: 'સ્વાગત છે',
    settings: 'સેટિંગ્સ',
    save: 'સેવ કરો',
    cancel: 'રદ કરો',
    back: 'પાછળ',
    next: 'આગળ',
    continue: 'ચાલુ રાખો',
    loading: 'લોડ થઈ રહ્યું છે...',

    dashboard: 'ડેશબોર્ડ',
    assistant: 'આયુ સહાયક',
    medicines: 'દવાઓ',
    exercise: 'કસરત',
    garden: 'બગીચો',
    caregivers: 'સંભાળકર્તાઓ',
    emergency: 'કટોકટી',
    reports: 'રિપોર્ટ્સ',

    accessibility: 'સુલભતા',
    textSize: 'ટેક્સ્ટ સાઈઝ',
    language: 'ભાષા',
    theme: 'થીમ',
    darkMode: 'ડાર્ક મોડ',
    lightMode: 'લાઈટ મોડ',
    notifications: 'સૂચનાઓ',
    voicePreference: 'અવાજ પસંદગી',

    myCaregivers: 'મારા સંભાળકર્તાઓ',
    assignedCaregivers: 'તમારા નિયુક્ત સંભાળકર્તાઓ',
    noCaregivers: 'હજુ સુધી કોઈ સંભાળકર્તા નથી',
    contactCaregiver: 'સંપર્ક',
    callCaregiver: 'વૉઇસ કૉલ',
    videoCall: 'વીડિયો કૉલ',
    chat: 'ચેટ',
    lastSeen: 'છેલ્લે જોયું',
    online: 'ઑનલાઈન',
    offline: 'ઑફલાઈન',

    login: 'લૉગિન',
    signup: 'સાઈન અપ',
    email: 'ઈમેલ',
    password: 'પાસવર્ડ',
    fullName: 'પૂરું નામ',
    phoneNumber: 'ફોન નંબર',
    selectLanguage: 'તમારી ભાષા પસંદ કરો',
    selectTextSize: 'ટેક્સ્ટ સાઈઝ પસંદ કરો',
    createAccount: 'એકાઉન્ટ બનાવો',
    alreadyHaveAccount: 'પહેલેથી એકાઉન્ટ છે?',

    goodMorning: 'સુપ્રભાત',
    goodAfternoon: 'શુભ બપોર',
    goodEvening: 'શુભ સાંજ',
    howAreYou: 'આજે તમે કેવું અનુભવો છો?',
    nextMedicine: 'આગળની દવા',
    waterIntake: 'પાણી પીવું',
    todayActivity: 'આજની પ્રવૃત્તિ',

    sosButton: 'SOS કટોકટી',
    emergencyContacts: 'કટોકટી સંપર્કો',
    callEmergency: 'કટોકટી કૉલ',
  },
  kn: {
    appName: 'ಆಯು AI',
    welcome: 'ಸ್ವಾಗತ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    save: 'ಉಳಿಸು',
    cancel: 'ರದ್ದುಮಾಡು',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    continue: 'ಮುಂದುವರಿಸು',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',

    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    assistant: 'ಆಯು ಸಹಾಯಕ',
    medicines: 'ಔಷಧಿಗಳು',
    exercise: 'ವ್ಯಾಯಾಮ',
    garden: 'ತೋಟ',
    caregivers: 'ಆರೈಕೆದಾರರು',
    emergency: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ',
    reports: 'ವರದಿಗಳು',

    accessibility: 'ಪ್ರವೇಶಸಾಧ್ಯತೆ',
    textSize: 'ಪಠ್ಯ ಗಾತ್ರ',
    language: 'ಭಾಷೆ',
    theme: 'ಥೀಮ್',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    lightMode: 'ಲೈಟ್ ಮೋಡ್',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    voicePreference: 'ಧ್ವನಿ ಆದ್ಯತೆ',

    myCaregivers: 'ನನ್ನ ಆರೈಕೆದಾರರು',
    assignedCaregivers: 'ನಿಮ್ಮ ನಿಯೋಜಿತ ಆರೈಕೆದಾರರು',
    noCaregivers: 'ಇನ್ನೂ ಆರೈಕೆದಾರರು ಇಲ್ಲ',
    contactCaregiver: 'ಸಂಪರ್ಕ',
    callCaregiver: 'ವಾಯ್ಸ್ ಕಾಲ್',
    videoCall: 'ವೀಡಿಯೋ ಕಾಲ್',
    chat: 'ಚಾಟ್',
    lastSeen: 'ಕೊನೆಯದಾಗಿ ನೋಡಿದ್ದು',
    online: 'ಆನ್‌ಲೈನ್',
    offline: 'ಆಫ್‌ಲೈನ್',

    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ನಂಬರ್',
    selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectTextSize: 'ಪಠ್ಯ ಗಾತ್ರ ಆಯ್ಕೆಮಾಡಿ',
    createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',

    goodMorning: 'ಶುಭೋದಯ',
    goodAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    goodEvening: 'ಶುಭ ಸಂಜೆ',
    howAreYou: 'ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ?',
    nextMedicine: 'ಮುಂದಿನ ಔಷಧಿ',
    waterIntake: 'ನೀರು ಸೇವನೆ',
    todayActivity: 'ಇಂದಿನ ಚಟುವಟಿಕೆ',

    sosButton: 'SOS ತುರ್ತು',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    callEmergency: 'ತುರ್ತು ಕರೆ',
  },
  ml: {
    appName: 'ആയു AI',
    welcome: 'സ്വാഗതം',
    settings: 'ക്രമീകരണങ്ങൾ',
    save: 'സേവ്',
    cancel: 'റദ്ദാക്കുക',
    back: 'തിരികെ',
    next: 'അടുത്തത്',
    continue: 'തുടരുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',

    dashboard: 'ഡാഷ്‌ബോർഡ്',
    assistant: 'ആയു അസിസ്റ്റന്റ്',
    medicines: 'മരുന്നുകൾ',
    exercise: 'വ്യായാമം',
    garden: 'പൂന്തോട്ടം',
    caregivers: 'പരിചാരകർ',
    emergency: 'അടിയന്തിരാവസ്ഥ',
    reports: 'റിപ്പോർട്ടുകൾ',

    accessibility: 'ആക്സസിബിലിറ്റി',
    textSize: 'ടെക്സ്റ്റ് സൈസ്',
    language: 'ഭാഷ',
    theme: 'തീം',
    darkMode: 'ഡാർക്ക് മോഡ്',
    lightMode: 'ലൈറ്റ് മോഡ്',
    notifications: 'അറിയിപ്പുകൾ',
    voicePreference: 'ശബ്ദ മുൻഗണന',

    myCaregivers: 'എന്റെ പരിചാരകർ',
    assignedCaregivers: 'നിങ്ങളുടെ നിയുക്ത പരിചാരകർ',
    noCaregivers: 'ഇതുവരെ പരിചാരകരില്ല',
    contactCaregiver: 'ബന്ധപ്പെടുക',
    callCaregiver: 'വോയ്സ് കോൾ',
    videoCall: 'വീഡിയോ കോൾ',
    chat: 'ചാറ്റ്',
    lastSeen: 'അവസാനം കണ്ടത്',
    online: 'ഓൺലൈൻ',
    offline: 'ഓഫ്‌ലൈൻ',

    login: 'ലോഗിൻ',
    signup: 'സൈൻ അപ്പ്',
    email: 'ഇമെയിൽ',
    password: 'പാസ്‌വേഡ്',
    fullName: 'മുഴുവൻ പേര്',
    phoneNumber: 'ഫോൺ നമ്പർ',
    selectLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    selectTextSize: 'ടെക്സ്റ്റ് സൈസ് തിരഞ്ഞെടുക്കുക',
    createAccount: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    alreadyHaveAccount: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?',

    goodMorning: 'സുപ്രഭാതം',
    goodAfternoon: 'ശുഭ ഉച്ച',
    goodEvening: 'ശുഭ സന്ധ്യ',
    howAreYou: 'ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെ തോന്നുന്നു?',
    nextMedicine: 'അടുത്ത മരുന്ന്',
    waterIntake: 'വെള്ളം കുടിക്കൽ',
    todayActivity: 'ഇന്നത്തെ പ്രവർത്തനം',

    sosButton: 'SOS അടിയന്തിരം',
    emergencyContacts: 'അടിയന്തിര ബന്ധങ്ങൾ',
    callEmergency: 'അടിയന്തിര കോൾ',
  },
  pa: {
    appName: 'ਆਯੂ AI',
    welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    settings: 'ਸੈਟਿੰਗਾਂ',
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    back: 'ਪਿੱਛੇ',
    next: 'ਅੱਗੇ',
    continue: 'ਜਾਰੀ ਰੱਖੋ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',

    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    assistant: 'ਆਯੂ ਸਹਾਇਕ',
    medicines: 'ਦਵਾਈਆਂ',
    exercise: 'ਕਸਰਤ',
    garden: 'ਬਾਗ',
    caregivers: 'ਦੇਖਭਾਲ ਕਰਨ ਵਾਲੇ',
    emergency: 'ਐਮਰਜੈਂਸੀ',
    reports: 'ਰਿਪੋਰਟਾਂ',

    accessibility: 'ਪਹੁੰਚਯੋਗਤਾ',
    textSize: 'ਟੈਕਸਟ ਸਾਈਜ਼',
    language: 'ਭਾਸ਼ਾ',
    theme: 'ਥੀਮ',
    darkMode: 'ਡਾਰਕ ਮੋਡ',
    lightMode: 'ਲਾਈਟ ਮੋਡ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    voicePreference: 'ਆਵਾਜ਼ ਪਸੰਦ',

    myCaregivers: 'ਮੇਰੇ ਦੇਖਭਾਲਕਰਤਾ',
    assignedCaregivers: 'ਤੁਹਾਡੇ ਨਿਯੁਕਤ ਦੇਖਭਾਲਕਰਤਾ',
    noCaregivers: 'ਅਜੇ ਕੋਈ ਦੇਖਭਾਲਕਰਤਾ ਨਹੀਂ',
    contactCaregiver: 'ਸੰਪਰਕ ਕਰੋ',
    callCaregiver: 'ਵੌਇਸ ਕਾਲ',
    videoCall: 'ਵੀਡੀਓ ਕਾਲ',
    chat: 'ਚੈਟ',
    lastSeen: 'ਆਖਰੀ ਵਾਰ ਦੇਖਿਆ',
    online: 'ਔਨਲਾਈਨ',
    offline: 'ਔਫਲਾਈਨ',

    login: 'ਲੌਗਇਨ',
    signup: 'ਸਾਈਨ ਅੱਪ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    phoneNumber: 'ਫ਼ੋਨ ਨੰਬਰ',
    selectLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    selectTextSize: 'ਟੈਕਸਟ ਸਾਈਜ਼ ਚੁਣੋ',
    createAccount: 'ਖਾਤਾ ਬਣਾਓ',
    alreadyHaveAccount: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?',

    goodMorning: 'ਸ਼ੁਭ ਸਵੇਰ',
    goodAfternoon: 'ਸ਼ੁਭ ਦੁਪਹਿਰ',
    goodEvening: 'ਸ਼ੁਭ ਸ਼ਾਮ',
    howAreYou: 'ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?',
    nextMedicine: 'ਅਗਲੀ ਦਵਾਈ',
    waterIntake: 'ਪਾਣੀ ਪੀਣਾ',
    todayActivity: 'ਅੱਜ ਦੀ ਗਤੀਵਿਧੀ',

    sosButton: 'SOS ਐਮਰਜੈਂਸੀ',
    emergencyContacts: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
    callEmergency: 'ਐਮਰਜੈਂਸੀ ਕਾਲ',
  },
  or: {
    appName: 'ଆୟୁ AI',
    welcome: 'ସ୍ୱାଗତ',
    settings: 'ସେଟିଂସ୍',
    save: 'ସେଭ୍',
    cancel: 'ବାତିଲ',
    back: 'ପଛକୁ',
    next: 'ପରବର୍ତ୍ତୀ',
    continue: 'ଜାରି ରଖନ୍ତୁ',
    loading: 'ଲୋଡ୍ ହେଉଛି...',

    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    assistant: 'ଆୟୁ ସହାୟକ',
    medicines: 'ଔଷଧ',
    exercise: 'ବ୍ୟାୟାମ',
    garden: 'ବଗିଚା',
    caregivers: 'ଯତ୍ନକାରୀ',
    emergency: 'ଜରୁରୀ ଅବସ୍ଥା',
    reports: 'ରିପୋର୍ଟ',

    accessibility: 'ସୁଗମ୍ୟତା',
    textSize: 'ଟେକ୍ସଟ୍ ସାଇଜ୍',
    language: 'ଭାଷା',
    theme: 'ଥିମ୍',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    notifications: 'ବିଜ୍ଞପ୍ତି',
    voicePreference: 'ସ୍ୱର ପସନ୍ଦ',

    myCaregivers: 'ମୋର ଯତ୍ନକାରୀ',
    assignedCaregivers: 'ଆପଣଙ୍କ ନିଯୁକ୍ତ ଯତ୍ନକାରୀ',
    noCaregivers: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଯତ୍ନକାରୀ ନାହାଁନ୍ତି',
    contactCaregiver: 'ଯୋଗାଯୋଗ',
    callCaregiver: 'ଭଏସ୍ କଲ୍',
    videoCall: 'ଭିଡିଓ କଲ୍',
    chat: 'ଚାଟ୍',
    lastSeen: 'ଶେଷଥର ଦେଖାଗଲା',
    online: 'ଅନଲାଇନ୍',
    offline: 'ଅଫଲାଇନ୍',

    login: 'ଲଗଇନ୍',
    signup: 'ସାଇନ୍ ଅପ୍',
    email: 'ଇମେଲ୍',
    password: 'ପାସୱାର୍ଡ',
    fullName: 'ପୂର୍ଣ୍ଣ ନାମ',
    phoneNumber: 'ଫୋନ୍ ନମ୍ବର',
    selectLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    selectTextSize: 'ଟେକ୍ସଟ୍ ସାଇଜ୍ ବାଛନ୍ତୁ',
    createAccount: 'ଏକାଉଣ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ',
    alreadyHaveAccount: 'ପୂର୍ବରୁ ଏକାଉଣ୍ଟ ଅଛି?',

    goodMorning: 'ଶୁଭ ସକାଳ',
    goodAfternoon: 'ଶୁଭ ଅପରାହ୍ନ',
    goodEvening: 'ଶୁଭ ସନ୍ଧ୍ୟା',
    howAreYou: 'ଆଜି ଆପଣ କେମିତି ଅନୁଭବ କରୁଛନ୍ତି?',
    nextMedicine: 'ପରବର୍ତ୍ତୀ ଔଷଧ',
    waterIntake: 'ପାଣି ପିଇବା',
    todayActivity: 'ଆଜିର କାର୍ଯ୍ୟକଳାପ',

    sosButton: 'SOS ଜରୁରୀ',
    emergencyContacts: 'ଜରୁରୀ ସମ୍ପର୍କ',
    callEmergency: 'ଜରୁରୀ କଲ୍',
  },
  as: {
    appName: 'আয়ু AI',
    welcome: 'স্বাগতম',
    settings: 'ছেটিংছ',
    save: 'ছেভ',
    cancel: 'বাতিল',
    back: 'পিছলৈ',
    next: 'পৰৱৰ্তী',
    continue: 'চলাই যাওক',
    loading: 'ল\'ড হৈ আছে...',

    dashboard: 'ডেছব\'ৰ্ড',
    assistant: 'আয়ু সহায়ক',
    medicines: 'ঔষধ',
    exercise: 'ব্যায়াম',
    garden: 'বাগিচা',
    caregivers: 'যত্নকাৰী',
    emergency: 'জৰুৰীকালীন অৱস্থা',
    reports: 'প্ৰতিবেদন',

    accessibility: 'সুগম্যতা',
    textSize: 'টেক্সট চাইজ',
    language: 'ভাষা',
    theme: 'থিম',
    darkMode: 'ডাৰ্ক ম\'ড',
    lightMode: 'লাইট ম\'ড',
    notifications: 'জাননী',
    voicePreference: 'কণ্ঠ পছন্দ',

    myCaregivers: 'মোৰ যত্নকাৰী',
    assignedCaregivers: 'আপোনাৰ নিযুক্ত যত্নকাৰী',
    noCaregivers: 'এতিয়ালৈ কোনো যত্নকাৰী নাই',
    contactCaregiver: 'যোগাযোগ',
    callCaregiver: 'ভইচ কল',
    videoCall: 'ভিডিঅ\' কল',
    chat: 'চেট',
    lastSeen: 'শেষবাৰ দেখা',
    online: 'অনলাইন',
    offline: 'অফলাইন',

    login: 'লগইন',
    signup: 'ছাইন আপ',
    email: 'ইমেইল',
    password: 'পাছৱৰ্ড',
    fullName: 'সম্পূৰ্ণ নাম',
    phoneNumber: 'ফ\'ন নম্বৰ',
    selectLanguage: 'আপোনাৰ ভাষা নিৰ্বাচন কৰক',
    selectTextSize: 'টেক্সট চাইজ নিৰ্বাচন কৰক',
    createAccount: 'একাউণ্ট সৃষ্টি কৰক',
    alreadyHaveAccount: 'ইতিমধ্যে একাউণ্ট আছে?',

    goodMorning: 'শুভ ৰাতিপুৱা',
    goodAfternoon: 'শুভ দুপৰীয়া',
    goodEvening: 'শুভ সন্ধিয়া',
    howAreYou: 'আজি আপোনাৰ কেনে লাগিছে?',
    nextMedicine: 'পৰৱৰ্তী ঔষধ',
    waterIntake: 'পানী খোৱা',
    todayActivity: 'আজিৰ কাৰ্যকলাপ',

    sosButton: 'SOS জৰুৰীকালীন',
    emergencyContacts: 'জৰুৰীকালীন যোগাযোগ',
    callEmergency: 'জৰুৰীকালীন কল',
  },
};

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang] || translations.en;
}

export function useTranslation(lang: Language) {
  return getTranslation(lang);
}
