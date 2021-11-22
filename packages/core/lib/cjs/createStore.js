"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var effects_1 = require("@redux-saga/core/effects");
var core_1 = __importDefault(require("@redux-saga/core"));
function default_1(_a) {
    var hives = _a.hives, middlewares = _a.middlewares;
    // Combine reducers from the hives    
    var rootReducerConfig = {};
    for (var _i = 0, hives_1 = hives; _i < hives_1.length; _i++) {
        var hive = hives_1[_i];
        rootReducerConfig[hive.name] = hive.reducer;
    }
    var rootReducer = (0, redux_1.combineReducers)(rootReducerConfig);
    // Combine sagas from the hives
    var sagas = hives.map(function (h) { return h.saga; }).filter(function (s) { return !!s; });
    var rootSaga = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, effects_1.all)(__spreadArray([], sagas, true))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    // Apply middlewares
    var sagaMiddleware = (0, core_1.default)();
    var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
    var store = (0, redux_1.createStore)(rootReducer, composeEnhancers(redux_1.applyMiddleware.apply(void 0, __spreadArray(__spreadArray([], middlewares, false), [sagaMiddleware], false))));
    sagaMiddleware.run(rootSaga);
    return store;
}
exports.default = default_1;
