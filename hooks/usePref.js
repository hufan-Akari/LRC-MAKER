export const info = JSON.parse(document.getElementById("app-info").textContent);
export const themeColor = {
    orange: "#ff691f",
    yellow: "#fab81e",
    lime: "#7fdbb6",
    green: "#19cf86",
    blue: "#91d2fa",
    navy: "#1b95e0",
    grey: "#abb8c2",
    red: "#e81c4f",
    pink: "#f58ea8",
    purple: "#c877fe",
};
const initState = {
    lang: "en-US",
    spaceStart: 1,
    spaceEnd: 0,
    fixed: 3,
    builtInAudio: false,
    screenButton: false,
    themeColor: themeColor.pink,
    themeMode: 0,
};
const reducer = (state, action) => {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { [action.type]: typeof payload === "function" ? payload(state) : payload });
};
const init = (lazyInit) => {
    const state = initState;
    const languages = navigator.languages || [navigator.language || "en-US"];
    state.lang =
        languages
            .map((langCode) => {
            if (langCode === "zh") {
                return "zh-CN";
            }
            if (langCode.startsWith("en")) {
                return "en-US";
            }
            return langCode;
        })
            .find((langCode) => langCode in info.languages) || "en-US";
    try {
        const storedState = JSON.parse(lazyInit());
        const validKeys = Object.keys(initState);
        for (const key of validKeys) {
            if (key in storedState) {
                state[key] = storedState[key];
            }
        }
    }
    catch (error) {
    }
    return state;
};
export const usePref = (lazyInit) => React.useReducer(reducer, lazyInit, init);
//# sourceMappingURL=usePref.js.map