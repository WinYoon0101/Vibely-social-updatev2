import {
    faCode,
    faFlask,
    faBook,
    faGlobe,
    faLaptopCode,
    faPalette,
    faComments,
    faPhoneAlt,
    faEnvelope,
    faShareAlt,
    faSearch,
    faSlidersH,
    faFilter,
    faSort,
    faChartPie,
    faTable,
    faDatabase,
    faFileAlt,
    faCamera,
    faCalculator,
    faQuestion,
    faDna,
    faMagnet,
    faLanguage,
    faRobot,
    faCoffee,
    faLandmark,
    faBalanceScale,
    faTrophy,
    faChartLine,
    faGavel
} from '@fortawesome/free-solid-svg-icons';

function convertToFaIcons(textIcon) {
    switch (textIcon) {
        case 'faCode':
            return faCode;
        case 'faFlask':
            return faFlask;
        case 'faBook':
            return faBook;
        case 'faGlobe':
            return faGlobe;
        case 'faLaptopCode':
            return faLaptopCode;
        case 'faPalette':
            return faPalette;
        case 'faComments':
            return faComments;
        case 'faPhoneAlt':
            return faPhoneAlt;
        case 'faEnvelope':
            return faEnvelope;
        case 'faShareAlt':
            return faShareAlt;
        case 'faSearch':
            return faSearch;
        case 'faSlidersH':
            return faSlidersH;
        case 'faFilter':
            return faFilter;
        case 'faSort':
            return faSort;
        case 'faChartPie':
            return faChartPie;
        case 'faTable':
            return faTable;
        case 'faDatabase':
            return faDatabase;
        case 'faFileAlt':
            return faFileAlt;
        case 'faCamera':
            return faCamera;
        case 'faCalculator':
            return faCalculator;
        case 'faDna':
            return faDna;
        case 'faMagnet':
            return faMagnet;
        case 'faLanguage':
            return faLanguage;
        case 'faRobot':
            return faRobot;
        case 'faCoffee':
            return faCoffee;
        case 'faLandmark':
            return faLandmark;
        case 'faBalanceScale':
            return faBalanceScale;
        case 'faTrophy':
            return faTrophy;
        case 'faChartLine':
            return faChartLine;
        case 'faGavel':
            return faGavel;
        default:
            return faQuestion;
    }
}

export default convertToFaIcons;
