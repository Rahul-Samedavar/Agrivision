import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import farmerGif1 from './assets/farmer.gif'
import farmerGif2 from './assets/farmer2.gif'
import farmerGif3 from './assets/farmer3.gif'

const farmerGifs = [farmerGif1, farmerGif2, farmerGif3]

/* ── Loading animation with rotating farmer GIFs ── */
function LoadingAnimation({ text = 'Processing...' }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % farmerGifs.length), 2000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="loading-anim">
      <img src={farmerGifs[idx]} alt="Loading" />
      <p>{text}</p>
    </div>
  )
}

/* ── red marker icon for leaflet ── */
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agrivisionbackend-judy.onrender.com'
const APK_URL = 'https://expo.dev/artifacts/eas/Os8H7oZd1NBhZ8rJBATYKqqxHcNn4EtKGbRLzJijphQ.apk'
const languages = [
  ['en', 'English'], ['hi', 'Hindi'], ['mr', 'Marathi'], ['kn', 'Kannada'],
]
const copy = {
  en: {
    title: 'Farming Assistant', subtitle: 'Select your preferred language.', continue: 'Continue',
    welcome: 'Welcome', homeSubtitle: 'AGRIVISION HOME', greeting: 'Hello, Farmer,', overview: 'Here is your regional overview.',
    cards: [['🌿', 'Disease Detection', 'Scan crops instantly', 'scan'], ['🔬', 'Soil Labs', 'Find nearby labs', 'labs'], ['📰', 'News', 'Daily farming updates', 'news'], ['🏛️', 'Government Schemes', 'Browse subsidies', 'schemes']],
    assistantTag: 'HELP AT YOUR FINGERTIPS', assistant: 'Farming Assistant', openChat: 'Open Chatbot',
    ask: 'Ask about crops, pests...', send: 'Send', back: 'Back to Home', search: 'Enter location',
    detectLocation: 'Detect my location', detecting: 'Detecting...', playAudio: '🔊 Play',
    changeLanguage: 'Change Language', close: 'Close', goBack: 'Go back', settings: 'Settings',
    downloadApp: 'Download APK', webNotice: 'You’re using the web version of Agrivision. For a better experience, download the app.',
    downloadHere: 'Download here', dismiss: 'Dismiss', showcaseKicker: 'SMART FARMING, SIMPLIFIED',
    showcaseTitle: 'Meet', showcaseDescription: 'A multilingual farmer-assistance companion for healthier crops, better decisions, and stronger harvests.',
    featuresTitle: 'Built for every field', features: ['🌱 Crop health', '🧪 Soil insights', '🌾 Local guidance'],
    capturePhoto: 'Take Photo', cameraHelp: 'Take a photo of the affected plant area.',
    cameraUnavailable: 'Camera access is not available in this browser.', cameraPermission: 'Allow camera access to take a photo.',
    cameraStart: 'Start Camera', capture: 'Capture Photo', cancel: 'Cancel', gallery: 'Choose Gallery',
    galleryHelp: 'Upload Existing File', noImage: 'No Image Selected', previewHelp: 'Real-time preview will appear here',
    detectionTitle: 'Disease Detection', detectionDescription: 'Capture a clear photo of the affected plant area to begin the diagnostic analysis.',
    detectionTipsTitle: 'For accurate detection:', detectionTips: ['• Ensure the leaf is properly focused', '• Capture the main symptom area', '• Use good natural lighting'],
    selectImageFirst: 'Please select an image first', analyzing: 'Analyzing your crop...',
    noAnalysis: 'No analysis available', recommendedProducts: 'Recommended Products', buyNow: 'Buy Now',
    soilLabs: 'Soil Labs', proximity: 'PROXIMITY SERVICES',
    labsDescription: 'Discover agricultural research and testing facilities for specialized crop analysis.',
    enterLocation: 'Please enter a location', findingLabs: 'Finding nearby labs...', noLabs: 'No labs found for this location',
    governmentFacilities: '🏛️ Government Facilities', verifiedGovernment: 'VERIFIED GOV', visitPortal: 'Visit portal',
    localInsights: 'Local Insights', newsDescription: 'Enter a location to get local news updates',
    fetchingNews: 'Fetching latest news...', readMore: 'Read more ↗',
    schemes: 'Government Schemes', schemeFinance: 'Finance', schemeIrrigation: 'Irrigation', schemeSoil: 'Soil', schemeInsurance: 'Insurance',
    schemeFinanceDescription: 'Provides income support of INR 6000 per year to eligible farmer families.',
    schemeIrrigationDescription: 'Promotes efficient irrigation and better water management for farms.',
    schemeSoilDescription: 'Provides soil nutrient status and recommendations to farmers.',
    schemeInsuranceDescription: 'Crop insurance scheme protecting farmers from losses.',
    officialPortal: 'OFFICIAL PORTAL', applyNow: 'Apply Now →',
    chatTitle: 'AgriExpert Chat', startChat: 'Ask your farming question to get started.',
    thinking: 'Thinking...', voiceUnsupported: 'Voice input is not supported in this browser.',
    voiceError: 'Voice input could not be processed.', stop: '⏹️ Stop', chatWithMe: 'Chat with me 🌱',
    loading: 'Processing...',
  },
  hi: { title: 'कृषि सहायक', subtitle: 'अपनी पसंदीदा भाषा चुनें।', continue: 'जारी रखें', welcome: 'स्वागत है', homeSubtitle: 'एग्रीविज़न होम', greeting: 'नमस्ते किसान,', overview: 'यहाँ आपके क्षेत्र का विवरण है।', cards: [['🌿', 'रोग पहचान', 'फसलों को तुरंत स्कैन करें', 'scan'], ['🔬', 'मिट्टी प्रयोगशाला', 'नज़दीकी लैब खोजें', 'labs'], ['📰', 'समाचार', 'दैनिक कृषि समाचार', 'news'], ['🏛️', 'सरकारी योजनाएँ', 'सब्सिडी देखें', 'schemes']], assistantTag: 'आपकी मदद के लिए', assistant: 'कृषि सहायक', openChat: 'चैटबॉट खोलें', ask: 'फसल और कीटों के बारे में पूछें...', send: 'भेजें', back: 'होम पर जाएँ', search: 'स्थान दर्ज करें', detectLocation: 'मेरा स्थान पता करें', detecting: 'पता लगा रहे हैं...', playAudio: '🔊 सुनें',
    changeLanguage: 'भाषा बदलें', close: 'बंद करें', goBack: 'वापस जाएँ', settings: 'सेटिंग्स', downloadApp: 'ऐप डाउनलोड करें',
    webNotice: 'आप Agrivision के वेब संस्करण का उपयोग कर रहे हैं। बेहतर अनुभव के लिए ऐप डाउनलोड करें।', downloadHere: 'यहाँ डाउनलोड करें', dismiss: 'बंद करें',
    showcaseKicker: 'आसान स्मार्ट खेती', showcaseTitle: 'मिलें', showcaseDescription: 'स्वस्थ फसलों, बेहतर निर्णयों और अच्छी उपज के लिए बहुभाषी किसान सहायक।',
    featuresTitle: 'हर खेत के लिए', features: ['🌱 फसल स्वास्थ्य', '🧪 मिट्टी की जानकारी', '🌾 स्थानीय मार्गदर्शन'],
    capturePhoto: 'फ़ोटो लें', cameraHelp: 'प्रभावित पौधे की फ़ोटो लें।', cameraUnavailable: 'इस ब्राउज़र में कैमरा उपलब्ध नहीं है।', cameraPermission: 'फ़ोटो लेने के लिए कैमरा एक्सेस की अनुमति दें।',
    cameraStart: 'कैमरा शुरू करें', capture: 'फ़ोटो लें', cancel: 'रद्द करें', gallery: 'गैलरी चुनें', galleryHelp: 'मौजूदा फ़ाइल अपलोड करें',
    noImage: 'कोई छवि नहीं चुनी गई', previewHelp: 'फ़ोटो का पूर्वावलोकन यहाँ दिखाई देगा', detectionTitle: 'रोग पहचान', detectionDescription: 'जाँच शुरू करने के लिए प्रभावित पौधे की साफ़ फ़ोटो लें।',
    detectionTipsTitle: 'सटीक पहचान के लिए:', detectionTips: ['• पत्ती पर स्पष्ट फ़ोकस रखें', '• मुख्य लक्षण वाले हिस्से की फ़ोटो लें', '• प्राकृतिक रोशनी का उपयोग करें'],
    selectImageFirst: 'पहले एक छवि चुनें', analyzing: 'आपकी फसल की जाँच हो रही है...', noAnalysis: 'कोई विश्लेषण उपलब्ध नहीं है', recommendedProducts: 'अनुशंसित उत्पाद', buyNow: 'अभी खरीदें',
    soilLabs: 'मिट्टी प्रयोगशालाएँ', proximity: 'आस-पास की सेवाएँ', labsDescription: 'फसल जाँच के लिए कृषि अनुसंधान और परीक्षण केंद्र खोजें।',
    enterLocation: 'कृपया स्थान दर्ज करें', findingLabs: 'नज़दीकी लैब खोजी जा रही हैं...', noLabs: 'इस स्थान के लिए कोई लैब नहीं मिली',
    governmentFacilities: '🏛️ सरकारी केंद्र', verifiedGovernment: 'सत्यापित सरकारी', visitPortal: 'पोर्टल देखें',
    localInsights: 'स्थानीय जानकारी', newsDescription: 'स्थानीय समाचार पाने के लिए स्थान दर्ज करें', fetchingNews: 'ताज़ा समाचार लाए जा रहे हैं...', readMore: 'और पढ़ें ↗',
    schemes: 'सरकारी योजनाएँ', schemeFinance: 'वित्त', schemeIrrigation: 'सिंचाई', schemeSoil: 'मिट्टी', schemeInsurance: 'बीमा',
    schemeFinanceDescription: 'पात्र किसान परिवारों को प्रति वर्ष ₹6000 की आय सहायता।', schemeIrrigationDescription: 'कुशल सिंचाई और बेहतर जल प्रबंधन को बढ़ावा देती है।',
    schemeSoilDescription: 'किसानों को मिट्टी के पोषक तत्वों की स्थिति और सुझाव देती है।', schemeInsuranceDescription: 'फसल नुकसान से किसानों की सुरक्षा के लिए बीमा योजना।',
    officialPortal: 'आधिकारिक पोर्टल', applyNow: 'अभी आवेदन करें →', chatTitle: 'एग्रीएक्सपर्ट चैट', startChat: 'शुरू करने के लिए खेती से जुड़ा सवाल पूछें।',
    thinking: 'सोच रहे हैं...', voiceUnsupported: 'इस ब्राउज़र में आवाज़ से इनपुट उपलब्ध नहीं है।', voiceError: 'आवाज़ इनपुट पर काम नहीं हो सका।',
    stop: '⏹️ रोकें', chatWithMe: 'मुझसे बात करें 🌱', loading: 'प्रक्रिया जारी है...',
  },
  mr: { title: 'शेती सहाय्यक', subtitle: 'तुमची पसंतीची भाषा निवडा.', continue: 'पुढे जा', welcome: 'स्वागत', homeSubtitle: 'ॲग्रीव्हिजन होम', greeting: 'नमस्कार शेतकरी,', overview: 'तुमच्या प्रदेशाचा आढावा येथे आहे.', cards: [['🌿', 'रोग निदान', 'पिके त्वरित स्कॅन करा', 'scan'], ['🔬', 'माती प्रयोगशाळा', 'जवळच्या प्रयोगशाळा शोधा', 'labs'], ['📰', 'बातम्या', 'दैनिक शेती अपडेट्स', 'news'], ['🏛️', 'सरकारी योजना', 'अनुदाने पहा', 'schemes']], assistantTag: 'तुमच्या मदतीसाठी', assistant: 'शेती सहाय्यक', openChat: 'चॅटबॉट उघडा', ask: 'पिके आणि कीटकांबद्दल विचारा...', send: 'पाठवा', back: 'मुख्यपृष्ठावर जा', search: 'ठिकाण टाका', detectLocation: 'माझे स्थान शोधा', detecting: 'शोधत आहे...', playAudio: '🔊 ऐका',
    changeLanguage: 'भाषा बदला', close: 'बंद करा', goBack: 'मागे जा', settings: 'सेटिंग्ज', downloadApp: 'ॲप डाउनलोड करा',
    webNotice: 'तुम्ही Agrivision ची वेब आवृत्ती वापरत आहात. अधिक चांगल्या अनुभवासाठी ॲप डाउनलोड करा.', downloadHere: 'येथे डाउनलोड करा', dismiss: 'बंद करा',
    showcaseKicker: 'सोपे स्मार्ट शेती', showcaseTitle: 'भेटा', showcaseDescription: 'निरोगी पिके, चांगले निर्णय आणि भरघोस उत्पादनासाठी बहुभाषिक शेतकरी सहाय्यक.',
    featuresTitle: 'प्रत्येक शेतासाठी', features: ['🌱 पीक आरोग्य', '🧪 मातीची माहिती', '🌾 स्थानिक मार्गदर्शन'],
    capturePhoto: 'फोटो काढा', cameraHelp: 'प्रभावित झाडाचा फोटो काढा.', cameraUnavailable: 'या ब्राउझरमध्ये कॅमेरा उपलब्ध नाही.', cameraPermission: 'फोटो काढण्यासाठी कॅमेरा वापरण्याची परवानगी द्या.',
    cameraStart: 'कॅमेरा सुरू करा', capture: 'फोटो काढा', cancel: 'रद्द करा', gallery: 'गॅलरी निवडा', galleryHelp: 'आधीची फाइल अपलोड करा',
    noImage: 'प्रतिमा निवडलेली नाही', previewHelp: 'फोटोचे पूर्वावलोकन येथे दिसेल', detectionTitle: 'रोग निदान', detectionDescription: 'निदान सुरू करण्यासाठी प्रभावित झाडाचा स्पष्ट फोटो काढा.',
    detectionTipsTitle: 'अचूक निदानासाठी:', detectionTips: ['• पानावर योग्य फोकस ठेवा', '• लक्षणांचा मुख्य भाग टिपा', '• नैसर्गिक प्रकाश वापरा'],
    selectImageFirst: 'कृपया आधी प्रतिमा निवडा', analyzing: 'तुमच्या पिकाचे विश्लेषण सुरू आहे...', noAnalysis: 'विश्लेषण उपलब्ध नाही', recommendedProducts: 'शिफारस केलेली उत्पादने', buyNow: 'आता खरेदी करा',
    soilLabs: 'माती प्रयोगशाळा', proximity: 'जवळच्या सेवा', labsDescription: 'पीक विश्लेषणासाठी कृषी संशोधन आणि चाचणी केंद्रे शोधा.',
    enterLocation: 'कृपया ठिकाण टाका', findingLabs: 'जवळच्या प्रयोगशाळा शोधत आहे...', noLabs: 'या ठिकाणी प्रयोगशाळा आढळल्या नाहीत',
    governmentFacilities: '🏛️ सरकारी सुविधा', verifiedGovernment: 'सत्यापित सरकारी', visitPortal: 'पोर्टलला भेट द्या',
    localInsights: 'स्थानिक माहिती', newsDescription: 'स्थानिक बातम्यांसाठी ठिकाण टाका', fetchingNews: 'ताज्या बातम्या मिळवत आहे...', readMore: 'अधिक वाचा ↗',
    schemes: 'सरकारी योजना', schemeFinance: 'अर्थसहाय्य', schemeIrrigation: 'सिंचन', schemeSoil: 'माती', schemeInsurance: 'विमा',
    schemeFinanceDescription: 'पात्र शेतकरी कुटुंबांना दरवर्षी ₹६००० उत्पन्न सहाय्य.', schemeIrrigationDescription: 'कार्यक्षम सिंचन आणि चांगल्या जलव्यवस्थापनाला प्रोत्साहन.',
    schemeSoilDescription: 'मातीतील पोषक घटकांची स्थिती आणि शिफारसी शेतकऱ्यांना देते.', schemeInsuranceDescription: 'नुकसानीपासून संरक्षण देणारी पीक विमा योजना.',
    officialPortal: 'अधिकृत पोर्टल', applyNow: 'आता अर्ज करा →', chatTitle: 'ॲग्रीएक्सपर्ट चॅट', startChat: 'सुरू करण्यासाठी शेतीविषयी प्रश्न विचारा.',
    thinking: 'विचार करत आहे...', voiceUnsupported: 'या ब्राउझरमध्ये आवाजाद्वारे इनपुट उपलब्ध नाही.', voiceError: 'आवाज इनपुटवर प्रक्रिया करता आली नाही.',
    stop: '⏹️ थांबवा', chatWithMe: 'माझ्याशी बोला 🌱', loading: 'प्रक्रिया सुरू आहे...',
  },
  kn: { title: 'ಕೃಷಿ ಸಹಾಯಕ', subtitle: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.', continue: 'ಮುಂದುವರಿಸಿ', welcome: 'ಸ್ವಾಗತ', homeSubtitle: 'ಅಗ್ರಿವಿಷನ್ ಹೋಮ್', greeting: 'ನಮಸ್ಕಾರ ರೈತರೆ,', overview: 'ನಿಮ್ಮ ಪ್ರದೇಶದ ವಿವರ ಇಲ್ಲಿದೆ.', cards: [['🌿', 'ರೋಗ ಪತ್ತೆ', 'ಬೆಳೆಗಳನ್ನು ತಕ್ಷಣ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', 'scan'], ['🔬', 'ಮಣ್ಣಿನ ಪ್ರಯೋಗಾಲಯ', 'ಹತ್ತಿರದ ಲ್ಯಾಬ್ ಹುಡುಕಿ', 'labs'], ['📰', 'ಸುದ್ದಿ', 'ದೈನಂದಿನ ಕೃಷಿ ಮಾಹಿತಿ', 'news'], ['🏛️', 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', 'ಸಬ್ಸಿಡಿ ವೀಕ್ಷಿಸಿ', 'schemes']], assistantTag: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ', assistant: 'ಕೃಷಿ ಸಹಾಯಕ', openChat: 'ಚಾಟ್‌ಬಾಟ್ ತೆರೆಯಿರಿ', ask: 'ಬೆಳೆ ಮತ್ತು ಕೀಟಗಳ ಬಗ್ಗೆ ಕೇಳಿ...', send: 'ಕಳುಹಿಸಿ', back: 'ಮುಖಪುಟಕ್ಕೆ', search: 'ಸ್ಥಳ ನಮೂದಿಸಿ', detectLocation: 'ನನ್ನ ಸ್ಥಳ ಪತ್ತೆ', detecting: 'ಪತ್ತೆ ಮಾಡುತ್ತಿದೆ...', playAudio: '🔊 ಪ್ಲೇ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ', close: 'ಮುಚ್ಚಿ', goBack: 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', downloadApp: 'ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    webNotice: 'ನೀವು Agrivision ವೆಬ್ ಆವೃತ್ತಿಯನ್ನು ಬಳಸುತ್ತಿದ್ದೀರಿ. ಉತ್ತಮ ಅನುಭವಕ್ಕಾಗಿ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.', downloadHere: 'ಇಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', dismiss: 'ಮುಚ್ಚಿ',
    showcaseKicker: 'ಸರಳ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ', showcaseTitle: 'ಪರಿಚಯ', showcaseDescription: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು, ಉತ್ತಮ ನಿರ್ಧಾರಗಳು ಮತ್ತು ಉತ್ತಮ ಫಸಲಿಗಾಗಿ ಬಹುಭಾಷಾ ರೈತ ಸಹಾಯಕ.',
    featuresTitle: 'ಪ್ರತಿ ಹೊಲಕ್ಕೂ', features: ['🌱 ಬೆಳೆ ಆರೋಗ್ಯ', '🧪 ಮಣ್ಣಿನ ಮಾಹಿತಿ', '🌾 ಸ್ಥಳೀಯ ಮಾರ್ಗದರ್ಶನ'],
    capturePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ', cameraHelp: 'ಬಾಧಿತ ಸಸ್ಯದ ಫೋಟೋ ತೆಗೆಯಿರಿ.', cameraUnavailable: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ.', cameraPermission: 'ಫೋಟೋ ತೆಗೆಯಲು ಕ್ಯಾಮೆರಾ ಅನುಮತಿಯನ್ನು ನೀಡಿ.',
    cameraStart: 'ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ', capture: 'ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ', cancel: 'ರದ್ದುಮಾಡಿ', gallery: 'ಗ್ಯಾಲರಿ ಆಯ್ಕೆಮಾಡಿ', galleryHelp: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    noImage: 'ಯಾವುದೇ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿಲ್ಲ', previewHelp: 'ಫೋಟೋ ಪೂರ್ವವೀಕ್ಷಣೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ', detectionTitle: 'ರೋಗ ಪತ್ತೆ', detectionDescription: 'ರೋಗ ಪತ್ತೆ ಪ್ರಾರಂಭಿಸಲು ಬಾಧಿತ ಸಸ್ಯದ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    detectionTipsTitle: 'ನಿಖರ ಪತ್ತೆಗಾಗಿ:', detectionTips: ['• ಎಲೆಯ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ಫೋಕಸ್ ಮಾಡಿ', '• ಮುಖ್ಯ ಲಕ್ಷಣದ ಭಾಗವನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ', '• ನೈಸರ್ಗಿಕ ಬೆಳಕನ್ನು ಬಳಸಿ'],
    selectImageFirst: 'ದಯವಿಟ್ಟು ಮೊದಲು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ', analyzing: 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...', noAnalysis: 'ವಿಶ್ಲೇಷಣೆ ಲಭ್ಯವಿಲ್ಲ', recommendedProducts: 'ಶಿಫಾರಸು ಮಾಡಿದ ಉತ್ಪನ್ನಗಳು', buyNow: 'ಈಗ ಖರೀದಿಸಿ',
    soilLabs: 'ಮಣ್ಣಿನ ಪ್ರಯೋಗಾಲಯಗಳು', proximity: 'ಹತ್ತಿರದ ಸೇವೆಗಳು', labsDescription: 'ಬೆಳೆ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಕೃಷಿ ಸಂಶೋಧನೆ ಮತ್ತು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ.',
    enterLocation: 'ದಯವಿಟ್ಟು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ', findingLabs: 'ಹತ್ತಿರದ ಪ್ರಯೋಗಾಲಯಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...', noLabs: 'ಈ ಸ್ಥಳಕ್ಕೆ ಪ್ರಯೋಗಾಲಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    governmentFacilities: '🏛️ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು', verifiedGovernment: 'ಪರಿಶೀಲಿಸಿದ ಸರ್ಕಾರಿ', visitPortal: 'ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ',
    localInsights: 'ಸ್ಥಳೀಯ ಮಾಹಿತಿ', newsDescription: 'ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ', fetchingNews: 'ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...', readMore: 'ಇನ್ನಷ್ಟು ಓದಿ ↗',
    schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', schemeFinance: 'ಹಣಕಾಸು', schemeIrrigation: 'ನೀರಾವರಿ', schemeSoil: 'ಮಣ್ಣು', schemeInsurance: 'ವಿಮೆ',
    schemeFinanceDescription: 'ಅರ್ಹ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6000 ಆದಾಯ ಬೆಂಬಲ.', schemeIrrigationDescription: 'ಸಮರ್ಥ ನೀರಾವರಿ ಮತ್ತು ಉತ್ತಮ ನೀರಿನ ನಿರ್ವಹಣೆಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ.',
    schemeSoilDescription: 'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಶಿಫಾರಸುಗಳನ್ನು ರೈತರಿಗೆ ಒದಗಿಸುತ್ತದೆ.', schemeInsuranceDescription: 'ನಷ್ಟದಿಂದ ರೈತರನ್ನು ರಕ್ಷಿಸುವ ಬೆಳೆ ವಿಮಾ ಯೋಜನೆ.',
    officialPortal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್', applyNow: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ →', chatTitle: 'ಅಗ್ರಿಎಕ್ಸ್‌ಪರ್ಟ್ ಚಾಟ್', startChat: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.',
    thinking: 'ಯೋಚಿಸಲಾಗುತ್ತಿದೆ...', voiceUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಲ್ಲ.', voiceError: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಲಿಲ್ಲ.',
    stop: '⏹️ ನಿಲ್ಲಿಸಿ', chatWithMe: 'ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ 🌱', loading: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
  },
}

/* ── Reverse-geocode coords to city name ── */
async function reverseGeocode(lat, lon, language) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${language}`)
    const data = await res.json()
    return data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.display_name?.split(',')[0] || ''
  } catch { return '' }
}

/* ── Geolocation helper hook ── */
function useAutoLocation(setter, language) {
  const [detecting, setDetecting] = useState(false)
  const detect = async () => {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude, language)
        if (name) setter(name)
        setDetecting(false)
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }
  return { detecting, detect }
}

async function post(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || `Request failed (${response.status})`)
  return response.json()
}

function LanguageScreen({ language, setLanguage, onContinue }) {
  const t = copy[language]
  return <div className="language-screen">
    <span className="brand-badge">AGRIVISION</span>
    <h1>{t.title}</h1><p>{t.subtitle}</p>
    <div className="language-grid">{languages.map(([code, label]) => <button className={language === code ? 'language-button active' : 'language-button'} key={code} onClick={() => setLanguage(code)}>{label}</button>)}</div>
    <button className="primary-button" onClick={onContinue}>{t.continue}</button>
  </div>
}

function Settings({ language, setLanguage, onClose }) {
  const t = copy[language]
  return <div className="modal-backdrop"><div className="modal-card"><h2>{t.changeLanguage}</h2><div className="language-grid">{languages.map(([code, label]) => <button className={language === code ? 'language-button active' : 'language-button'} key={code} onClick={() => { setLanguage(code); onClose() }}>{label}</button>)}</div><button className="text-button" onClick={onClose}>{t.close}</button></div></div>
}

/* ── 1. Back button added to Screen wrapper ── */
function Screen({ children, language, setLanguage, onBack }) {
  const [settings, setSettings] = useState(false)
  return <div className={`mobile-screen${onBack ? ' has-back' : ''}`}>
    {onBack && <button className="back-button" aria-label={copy[language].goBack} onClick={onBack}>←</button>}
    <button className="settings-button" aria-label={copy[language].settings} onClick={() => setSettings(true)}>⚙️</button>
    {children}
    {settings && <Settings language={language} setLanguage={setLanguage} onClose={() => setSettings(false)} />}
  </div>
}

function Home({ language, setLanguage, navigate }) {
  const t = copy[language]
  return <Screen language={language} setLanguage={setLanguage}><main className="home-screen"><header className="home-header"><strong>{t.welcome}</strong><small>{t.homeSubtitle}</small></header><a className="home-download-button" href={APK_URL} target="_blank" rel="noreferrer"><span aria-hidden="true">⬇</span>{t.downloadApp}</a><h2>{t.greeting}</h2><p className="muted">{t.overview}</p><div className="feature-grid">{t.cards.map(([icon, title, description, route]) => <button className={`feature-card card-${route}`} key={route} onClick={() => navigate(route)}><span className="feature-icon">{icon}</span><strong>{title}</strong><small>{description}</small></button>)}</div></main></Screen>
}

function Scan({ language, setLanguage, navigate }) {
  const t = copy[language]; const [file, setFile] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const videoRef = useRef(null)
  const cameraStreamRef = useRef(null)
  const galleryInputRef = useRef(null)
  useEffect(() => {
    if (!cameraOpen) return undefined
    let cancelled = false
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then(stream => {
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        cameraStreamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => {
        if (!cancelled) {
          setError(t.cameraPermission)
          setCameraOpen(false)
        }
      })
    return () => {
      cancelled = true
      cameraStreamRef.current?.getTracks().forEach(track => track.stop())
      cameraStreamRef.current = null
    }
  }, [cameraOpen, t.cameraPermission, t.cameraUnavailable])
  const choose = (event) => {
    const selected = event.target.files?.[0]
    if (selected) setFile({ raw: selected, url: URL.createObjectURL(selected) })
    event.target.value = ''
  }
  const openCamera = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.cameraUnavailable)
      return
    }
    setError('')
    setCameraReady(false)
    setCameraOpen(true)
  }
  const capturePhoto = () => {
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) {
      setError(t.cameraUnavailable)
      return
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (!blob) {
        setError(t.cameraPermission)
        return
      }
      const photo = new File([blob], `agrivision-${Date.now()}.jpg`, { type: blob.type })
      setFile({ raw: photo, url: URL.createObjectURL(photo) })
      setError('')
      setCameraReady(false)
      setCameraOpen(false)
    }, 'image/jpeg', 0.92)
  }
  const detect = async () => {
    if (!file) { setError(t.selectImageFirst); return }
    setLoading(true); setError('')
    try { const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file.raw) }); const result = await post('/api/disease', { image: base64, query: 'Analyze this crop and suggest treatment', language }); navigate('result', { result, image: file.url }) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  if (loading) return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('home')}><main className="content-screen"><LoadingAnimation text={t.analyzing} /></main></Screen>
  return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('home')}>
    <main className="content-screen">
      <h1>🔬 {t.detectionTitle}</h1><p className="subtitle">{t.detectionDescription}</p>
      <div className="preview-card">{file ? <img src={file.url} alt={t.detectionTitle} /> : <><span>🖼️</span><strong>{t.noImage}</strong><small>{t.previewHelp}</small></>}</div>
      <div className="action-row">
        <button type="button" className="action-card" onClick={openCamera}><span>📷</span><strong>{t.capturePhoto}</strong><small>{t.cameraHelp}</small></button>
        <button type="button" className="action-card" onClick={() => galleryInputRef.current?.click()}><span>📁</span><strong>{t.gallery}</strong><small>{t.galleryHelp}</small></button>
        <input ref={galleryInputRef} className="gallery-input" type="file" accept="image/*" onChange={choose} />
      </div>
      <div className="tips-card"><span>ℹ️</span><div><strong>{t.detectionTipsTitle}</strong>{t.detectionTips.map(tip => <p key={tip}>{tip}</p>)}</div></div>
      {error && <p className="error">{error}</p>}
      <button className="primary-button" disabled={!file || loading} onClick={detect}>{`🔍 ${t.cards[0][1]}`}</button>
    </main>
    {cameraOpen && <div className="camera-overlay"><section className="camera-dialog"><h2>{t.capturePhoto}</h2><p>{cameraReady ? t.cameraHelp : t.cameraStart}</p><video ref={videoRef} autoPlay playsInline onLoadedMetadata={() => setCameraReady(true)} /><div><button className="camera-cancel" onClick={() => { setCameraReady(false); setCameraOpen(false) }}>{t.cancel}</button><button className="camera-capture" onClick={capturePhoto} disabled={!cameraReady}>{t.capture}</button></div></section></div>}
  </Screen>
}

function Result({ data, image, navigate, language, setLanguage }) {
  const t = copy[language]
  const analysis = data?.analysis || ''
  const [preview, setPreview] = useState(false)
  return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('scan')}>
    <main className="content-screen result-screen">
      {image && <>
        <img className="result-thumb" src={image} alt={t.detectionTitle} onClick={() => setPreview(true)} title={t.previewHelp} />
        {preview && <div className="image-lightbox" onClick={() => setPreview(false)}>
          <img src={image} alt={t.detectionTitle} />
          <button aria-label={t.close} onClick={() => setPreview(false)}>✕</button>
        </div>}
      </>}
      {analysis ? (
        <div className="analysis-md bot-md"><ReactMarkdown>{analysis}</ReactMarkdown></div>
      ) : (
        <p className="muted">{t.noAnalysis}</p>
      )}
      {data?.recommended_products?.length > 0 && <>
        <h2>{t.recommendedProducts}</h2>
        {data.recommended_products.map(product => (
          <article className="product-card" key={product.name}>
            {product.image_url && <img className="product-image" src={product.image_url} alt={product.name} />}
            <div>
              <strong>{product.name}</strong>
              <p>{product.price}</p>
              <a href={product.buy_link?.startsWith('http') ? product.buy_link : `https://${product.buy_link}`} target="_blank" rel="noreferrer">{t.buyNow}</a>
            </div>
          </article>
        ))}
      </>}
      <button className="primary-button" onClick={() => navigate('home')}>{t.back}</button>
    </main>
  </Screen>
}


/* ── 2 & 3. Labs with geolocation auto-detect and Leaflet map ── */
function Labs({ language, setLanguage, navigate }) {
  const t = copy[language]; const [place, setPlace] = useState(''); const [labs, setLabs] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const { detecting, detect: detectLoc } = useAutoLocation(setPlace, language)
  const search = async () => { if (!place.trim()) { setError(t.enterLocation); return } setLoading(true); setError(''); try { setLabs(await post('/api/soil', { place, language, lang: language })) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  const all = [...(labs?.government || []), ...(labs?.private || [])]
  /* Collect labs that have coordinates for the map — API uses lat/lon */
  const mappable = all.filter(lab => (lab.lat || lab.latitude) && (lab.lon || lab.lng || lab.longitude))
  const getLat = (l) => Number(l.lat ?? l.latitude)
  const getLon = (l) => Number(l.lon ?? l.lng ?? l.longitude)
  const mapCenter = mappable.length > 0
    ? [mappable.reduce((s, l) => s + getLat(l), 0) / mappable.length, mappable.reduce((s, l) => s + getLon(l), 0) / mappable.length]
    : [20.5937, 78.9629] // default India center

  return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('home')}><main className="content-screen"><h1>🌾 {t.soilLabs}</h1><small className="eyebrow">{t.proximity}</small><p className="subtitle">{t.labsDescription}</p><div className="search-row"><input value={place} onChange={e => setPlace(e.target.value)} placeholder={t.search} /><button aria-label={t.search} onClick={search}>🔍</button></div><button className="detect-location-btn" onClick={detectLoc} disabled={detecting}>{detecting ? `📍 ${t.detecting}` : `📍 ${t.detectLocation}`}</button>{loading && <LoadingAnimation text={t.findingLabs} />}{error && <p className="error">{error}</p>}

    {/* Leaflet map */}
    {labs && mappable.length > 0 && (
      <div className="lab-map-container">
        <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={false} style={{ height: '240px', width: '100%', borderRadius: '16px', marginBottom: '16px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />
          {mappable.map((lab, idx) => (
            <Marker key={idx} position={[getLat(lab), getLon(lab)]} icon={redIcon}>
              <Popup><strong>{lab.title}</strong><br />{lab.address}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    )}

    {labs && !all.length && <p className="muted">{t.noLabs}</p>}
    {labs?.government?.length > 0 && <h2>{t.governmentFacilities}</h2>}
    {all.map((lab, index) => <article className="lab-card" key={`${lab.title}-${index}`}><div className="lab-heading"><strong>{lab.title}</strong>{labs.government.includes(lab) && <span>{t.verifiedGovernment}</span>}</div><p>📍 {lab.address}</p><footer>📞 {lab.phoneNumber} <span>⭐ {lab.rating} ({lab.ratingCount})</span></footer>{lab.website && <a href={lab.website} target="_blank" rel="noreferrer">{t.visitPortal}</a>}</article>)}
  </main></Screen>
}

/* ── 2. News with geolocation auto-detect ── */
function News({ language, setLanguage, navigate }) {
  const t = copy[language]; const [place, setPlace] = useState(''); const [news, setNews] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const { detecting, detect: detectLoc } = useAutoLocation(setPlace, language)
  const search = async () => { setLoading(true); setError(''); try { setNews(await post('/api/news', { place, language })) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('home')}><main className="content-screen"><h1>{t.localInsights}</h1><p className="subtitle">{t.newsDescription}</p><div className="search-row"><input value={place} onChange={e => setPlace(e.target.value)} placeholder={t.search} /><button aria-label={t.search} onClick={search}>🔍</button></div><button className="detect-location-btn" onClick={detectLoc} disabled={detecting}>{detecting ? `📍 ${t.detecting}` : `📍 ${t.detectLocation}`}</button>{loading && <LoadingAnimation text={t.fetchingNews} />}{error && <p className="error">{error}</p>}{news.map((item, index) => <article className="news-card" key={`${item.title}-${index}`}><header><span>{item.source}</span><small>{item.date}</small></header><h3>{item.title}</h3><div>{item.snippet}{item.image_url && <img src={item.image_url} alt="" />}</div><a href={item.link} target="_blank" rel="noreferrer">{t.readMore}</a></article>)}</main></Screen>
}

function Schemes({ language, setLanguage, navigate }) {
  const t = copy[language]
  const schemes = [['PM-KISAN', t.schemeFinanceDescription, t.schemeFinance, 'https://pmkisan.gov.in/'], ['PMKSY', t.schemeIrrigationDescription, t.schemeIrrigation, 'https://pmksy.gov.in/'], ['Soil Health Card', t.schemeSoilDescription, t.schemeSoil, 'https://soilhealth.dac.gov.in/'], ['PMFBY', t.schemeInsuranceDescription, t.schemeInsurance, 'https://pmfby.gov.in/']]
  return <Screen language={language} setLanguage={setLanguage} onBack={() => navigate('home')}><main className="content-screen"><h1>🏛️ {t.schemes}</h1>{schemes.map(([title, description, category, url]) => <article className="scheme-card" key={title}><span>{category.toUpperCase()}</span><h2>{title}</h2><p>{description}</p><footer><small>{t.officialPortal}</small><a href={url} target="_blank" rel="noreferrer">{t.applyNow}</a></footer></article>)}</main></Screen>
}

/* ── 4, 5, 6. Chat with markdown rendering, mic fix, play-audio button ── */
function Chat({ language, onClose }) {
  const t = copy[language]; const [input, setInput] = useState(''); const [messages, setMessages] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null) // track currently playing audio
  const [playingIdx, setPlayingIdx] = useState(null) // which message index is playing

  /* auto-scroll */
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  /* ── 6. Send – store audioUrl but don't auto-play ── */
  const send = async (event) => {
    event?.preventDefault(); if (!input.trim()) return
    const text = input.trim(); setInput('')
    setMessages(prev => [...prev, { sender: 'user', text }])
    setLoading(true); setError('')
    try {
      const response = await post('/api/chat', { query: text, language })
      setMessages(prev => [...prev, { sender: 'bot', text: response.text || '', audioUrl: response.audioUrl || null }])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  /* ── 5. Web Speech API mic fix ── */
  const voice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setError(t.voiceUnsupported); return }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = language === 'en' ? 'en-IN' : `${language}-IN`
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.continuous = false

    rec.onstart = () => setListening(true)
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev ? `${prev} ${transcript}` : transcript)
    }
    rec.onerror = (e) => {
      if (e.error !== 'aborted') setError(t.voiceError)
      setListening(false)
    }
    rec.onend = () => setListening(false)

    recognitionRef.current = rec
    rec.start()
  }

  /* ── 6. Toggle play/stop audio on button click ── */
  const toggleAudio = (url, idx) => {
    // If same audio is playing, stop it
    if (audioRef.current && playingIdx === idx) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      setPlayingIdx(null)
      return
    }
    // Stop any currently playing audio first
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const audio = new Audio(url)
    audio.onended = () => { audioRef.current = null; setPlayingIdx(null) }
    audio.play().catch(() => {})
    audioRef.current = audio
    setPlayingIdx(idx)
  }

  return <div className="chat-overlay"><section className="chat-window">
    <header><strong>{t.chatTitle}</strong><button aria-label={t.close} onClick={onClose}>✕</button></header>
    <div className="messages">
      {messages.length === 0 && <p className="muted">{t.startChat}</p>}
      {messages.map((message, index) => (
        <div className={`message ${message.sender}`} key={index}>
          {message.sender === 'bot'
            ? <div className="bot-md"><ReactMarkdown>{message.text}</ReactMarkdown></div>
            : message.text}
          {/* 6. Show play/stop button for bot messages with audio */}
          {message.sender === 'bot' && message.audioUrl && (
            <button className={`play-audio-btn${playingIdx === index ? ' playing' : ''}`} onClick={() => toggleAudio(message.audioUrl, index)}>
              {playingIdx === index ? t.stop : t.playAudio}
            </button>
          )}
        </div>
      ))}
      {loading && <div className="message bot"><LoadingAnimation text={t.thinking} /></div>}
      <div ref={messagesEndRef} />
    </div>
    {error && <p className="error">{error}</p>}
    <form onSubmit={send}>
      <button type="button" className={listening ? 'mic-active' : ''} onClick={voice}>{listening ? '⏹️' : '🎙️'}</button>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={t.ask} />
      <button className="send-button">{t.send}</button>
    </form>
  </section></div>
}

function App() {
  const [language, setLanguage] = useState('en'); const [route, setRoute] = useState('language'); const [payload, setPayload] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [showWebNotice, setShowWebNotice] = useState(true)
  useEffect(() => { document.documentElement.lang = language }, [language])
  const navigate = (nextRoute, nextPayload = null) => { setPayload(nextPayload); setRoute(nextRoute) }
  const showFab = route !== 'language'
  const app = useMemo(() => {
    if (route === 'language') return <LanguageScreen language={language} setLanguage={setLanguage} onContinue={() => navigate('home')} />
    if (route === 'home') return <Home language={language} setLanguage={setLanguage} navigate={navigate} />
    if (route === 'scan') return <Scan language={language} setLanguage={setLanguage} navigate={navigate} />
    if (route === 'result') return <Result language={language} setLanguage={setLanguage} navigate={navigate} data={payload?.result} image={payload?.image} />
    if (route === 'labs') return <Labs language={language} setLanguage={setLanguage} navigate={navigate} />
    if (route === 'news') return <News language={language} setLanguage={setLanguage} navigate={navigate} />
    if (route === 'schemes') return <Schemes language={language} setLanguage={setLanguage} navigate={navigate} />
    return <Home language={language} setLanguage={setLanguage} navigate={navigate} />
  }, [language, route, payload])
  const t = copy[language]
  return <div className="showcase">
    <div className="showcase-copy"><span className="showcase-kicker">{t.showcaseKicker}</span><h1>{t.showcaseTitle} <em>Agrivision</em></h1><p>{t.showcaseDescription}</p><a className="install-button" href={APK_URL} target="_blank" rel="noreferrer">⬇ {t.downloadApp}</a></div>
    <a className="mobile-download-button" href={APK_URL} target="_blank" rel="noreferrer" aria-label={t.downloadApp} title={t.downloadApp}>⬇</a>
    <div className="phone-frame"><div className="phone-speaker" /><div className="phone-screen">{app}{showFab && <div className="chat-fab-wrap">{route === 'home' && <span className="chat-fab-tooltip">{t.chatWithMe}</span>}<button className="chat-fab" onClick={() => setChatOpen(true)} aria-label={t.openChat}>💬</button></div>}{chatOpen && <Chat language={language} onClose={() => setChatOpen(false)} />}</div></div>
    <div className="showcase-features"><strong>{t.featuresTitle}</strong>{t.features.map(feature => <span key={feature}>{feature}</span>)}</div>
    {showWebNotice && <aside className="web-notice" role="dialog" aria-label={t.webNotice}>
      <button className="web-notice-close" onClick={() => setShowWebNotice(false)} aria-label={t.dismiss}>✕</button>
      <p>{t.webNotice}</p><a href={APK_URL} target="_blank" rel="noreferrer">⬇ {t.downloadHere}</a>
    </aside>}
  </div>
}

export default App
