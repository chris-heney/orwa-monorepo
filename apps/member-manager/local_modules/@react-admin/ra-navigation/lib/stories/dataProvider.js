"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slowDataProvider = exports.dataProvider = void 0;
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_admin_1 = require("react-admin");
var baseDataProvider = (0, ra_data_fakerest_1.default)({
    songs: [
        {
            id: 1,
            rank: 1,
            artist_id: 1,
            title: 'Like a Rolling Stone',
            writer: 'Bob Dylan',
            producer: 'Tom Wilson',
            released: new Date('1965-07-01'),
            recordCompany: 'Columbia',
            type: ['Rock', 'Folk Rock'],
        },
        {
            id: 2,
            rank: 2,
            artist_id: 2,
            title: '(I Can’t Get No) Satisfaction',
            writer: 'Mick Jagger, Keith Richards',
            producer: 'Andrew Loog Oldham',
            released: new Date('1965-05-01'),
            recordCompany: 'Decca',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 3,
            rank: 3,
            artist_id: 3,
            title: 'Imagine',
            writer: 'John Lennon',
            producer: 'Lennon, Phil Spector, Yoko Ono',
            released: new Date('1971-10-01'),
            recordCompany: 'Apple',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 4,
            rank: 4,
            artist_id: 4,
            title: 'What’s Going On',
            writer: 'Marvin Gaye, Renaldo Benson, Al Cleveland',
            producer: 'Marvin Gaye',
            released: new Date('1971-01-20'),
            recordCompany: 'Tamla',
            type: ['Jazz', 'RB'],
        },
        {
            id: 5,
            rank: 5,
            artist_id: 1,
            title: 'Blowin’ in the Wind',
            writer: 'Bob Dylan',
            producer: 'Tom Wilson',
            released: new Date('1963-05-27'),
            recordCompany: 'Columbia',
            type: ['Rock', 'Folk Rock'],
        },
        {
            id: 6,
            rank: 6,
            artist_id: 1,
            title: 'The Times They Are A-Changin’',
            writer: 'Bob Dylan',
            producer: 'Tom Wilson',
            released: new Date('1964-01-13'),
            recordCompany: 'Columbia',
            type: ['Rock', 'Folk Rock'],
        },
        {
            id: 7,
            rank: 7,
            artist_id: 2,
            title: 'Paint It, Black',
            writer: 'Mick Jagger, Keith Richards',
            producer: 'Andrew Loog Oldham',
            released: new Date('1966-05-07'),
            recordCompany: 'Decca',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 8,
            rank: 8,
            artist_id: 2,
            title: 'Gimme Shelter',
            writer: 'Mick Jagger, Keith Richards',
            producer: 'Jimmy Miller',
            released: new Date('1969-12-05'),
            recordCompany: 'Decca',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 9,
            rank: 9,
            artist_id: 3,
            title: 'Come Together',
            writer: 'John Lennon, Paul McCartney',
            producer: 'George Martin',
            released: new Date('1969-10-06'),
            recordCompany: 'Apple',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 10,
            rank: 10,
            artist_id: 3,
            title: 'Hey Jude',
            writer: 'John Lennon, Paul McCartney',
            producer: 'George Martin',
            released: new Date('1968-08-26'),
            recordCompany: 'Apple',
            type: ['Rock', 'Pop Rock'],
        },
        {
            id: 11,
            rank: 11,
            artist_id: 4,
            title: 'I Heard It Through the Grapevine',
            writer: 'Norman Whitfield, Barrett Strong',
            producer: 'Norman Whitfield',
            released: new Date('1968-10-30'),
            recordCompany: 'Tamla',
            type: ['Jazz', 'RB'],
        },
    ],
    artists: [
        {
            id: 1,
            name: 'Bob Dylan',
            type: ['Rock', 'Folk Rock'],
            yearsActive: '1960-',
            bio: "Bob Dylan (born Robert Allen Zimmerman, May 24, 1941) is an American singer-songwriter, author, and artist who has been an influential figure in popular music and culture for more than five decades. Much of his most celebrated work dates from the 1960s, when songs such as \"Blowin' in the Wind\" (1963) and \"The Times They Are a-Changin'\" (1964) became anthems for the civil rights and anti-war movements. Dylan's lyrics incorporate a wide range of political, social, philosophical, and literary influences; they defied existing pop music conventions and appealed to the burgeoning counterculture. Initially inspired by the performances of Little Richard, Buddy Holly, Elvis Presley, and Carl Perkins, Dylan's music draws from a variety of sources, including traditional folk, blues, country, gospel, rock and roll, and rockabilly.",
        },
        {
            id: 2,
            name: 'The Rolling Stones',
            type: ['Rock', 'Pop Rock'],
            yearsActive: '1962-',
            bio: "The Rolling Stones are an English rock band formed in London in 1962. The first stable line-up consisted of bandleader Brian Jones (guitar, harmonica), Mick Jagger (lead vocals), Keith Richards (guitar, vocals), Bill Wyman (bass), Charlie Watts (drums), and Ian Stewart (piano). Stewart was removed from the official line-up in 1963 but continued as a touring member until his death in 1985. Jones left the band less than a month prior to his death in 1969, having already been replaced by Mick Taylor, who remained until 1974. After Taylor left the band, Ronnie Wood took his place in 1975 and has been on guitar in tandem with Richards ever since. Following Wyman's departure in 1993, Darryl Jones joined as their touring bassist. Other touring keyboardists for the band have been Nicky Hopkins, Billy Preston, and Chuck Leavell. The band's primary songwriters, Jagger and Richards, assumed leadership after Andrew Loog Oldham became the group's manager.",
        },
        {
            id: 3,
            name: 'The Beatles',
            type: ['Rock', 'Pop Rock'],
            yearsActive: '1960-1970',
            bio: "The Beatles were an English rock band formed in Liverpool in 1960. With members John Lennon, Paul McCartney, George Harrison and Ringo Starr, they became widely regarded as the foremost and most influential act of the rock era. Rooted in skiffle, beat and 1950s rock and roll, their sound incorporated elements of classical music and traditional pop in innovative ways; the band later explored music styles ranging from ballads and Indian music to psychedelia and hard rock, often incorporating classical arrangements, unconventional recording techniques and instrumentation. In the early 1960s, their enormous popularity first emerged as \"Beatlemania\", but as their songwriting grew in sophistication, they came to be perceived as an embodiment of the ideals shared by the era's sociocultural revolutions.",
        },
        {
            id: 4,
            name: 'Marvin Gaye',
            type: ['Jazz', 'RB'],
            yearsActive: '1961-1984',
            bio: 'Marvin Pentz Gay Jr., who also spelled his surname as Gaye (April 2, 1939 – April 1, 1984),[2] was an American singer and songwriter. He helped to shape the sound of Motown in the 1960s, first as an in-house session player and later as a solo artist with a string of successes, earning him the nicknames "Prince of Motown" and "Prince of Soul".',
        },
    ],
}, process.env.NODE_ENV !== 'test');
exports.dataProvider = (0, react_admin_1.withLifecycleCallbacks)(baseDataProvider, [
    {
        resource: 'songs',
        beforeGetList: function (params) { return __awaiter(void 0, void 0, void 0, function () {
            var finalParams;
            return __generator(this, function (_a) {
                finalParams = __assign({}, params);
                if (params.filter && params.filter.released_gte) {
                    finalParams.filter = __assign(__assign({}, finalParams.filter), { released_gte: new Date(params.filter.released_gte) });
                }
                if (params.filter && params.filter.released_lt) {
                    finalParams.filter = __assign(__assign({}, finalParams.filter), { released_lt: new Date(params.filter.released_lt) });
                }
                return [2 /*return*/, finalParams];
            });
        }); },
    },
]);
exports.slowDataProvider = new Proxy(exports.dataProvider, {
    get: function (target, name) { return function (resource, params) {
        if (typeof name === 'symbol' || name === 'then') {
            return;
        }
        return new Promise(function (resolve) {
            return setTimeout(function () { return resolve(exports.dataProvider[name](resource, params)); }, 1000);
        });
    }; },
});
