import { parser } from "../lrc-parser.js";
export const guard = (value, min, max) => {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
};
const mergeObject = (target, obj) => {
    for (const i in obj) {
        if (target[i] !== obj[i]) {
            return Object.assign(Object.assign({}, target), obj);
        }
    }
    return target;
};
const reducer = (state, action) => {
    switch (action.type) {
        case 0: {
            const { text, options } = action.payload;
            const lrc = parser(text, options);
            const selectIndex = guard(state.selectIndex, 0, lrc.lyric.length - 1);
            return Object.assign(Object.assign(Object.assign({}, state), lrc), { selectIndex });
        }
        case 1: {
            const audioTime = action.payload;
            if (audioTime >= state.currentTime && audioTime < state.nextTime) {
                return state;
            }
            const record = state.lyric.reduce((p, c, i) => {
                if (c.time) {
                    if (c.time < p.nextTime && c.time > audioTime) {
                        p.nextTime = c.time;
                        p.nextIndex = i;
                    }
                    if (c.time > p.currentTime && c.time <= audioTime) {
                        p.currentTime = c.time;
                        p.currentIndex = i;
                    }
                }
                return p;
            }, {
                currentTime: -Infinity,
                currentIndex: -Infinity,
                nextTime: Infinity,
                nextIndex: Infinity,
            });
            return mergeObject(state, record);
        }
        case 2: {
            const time = action.payload;
            const index = state.selectIndex;
            let lyric = state.lyric;
            if (lyric[index].time !== time) {
                const newLyric = lyric.slice();
                newLyric[index] = { text: lyric[index].text, time };
                lyric = newLyric;
            }
            const selectIndex = guard(index + 1, 0, lyric.length - 1);
            return Object.assign(Object.assign({}, state), { lyric, selectIndex, currentTime: time, nextTime: -Infinity });
        }
        case 3: {
            const { name, value } = action.payload;
            const info = new Map(state.info);
            if (value.trim() === "") {
                info.delete(name);
            }
            else {
                info.set(name, value.trim());
            }
            return Object.assign(Object.assign({}, state), { info });
        }
        case 4: {
            const selectIndex = guard(action.payload(state.selectIndex), 0, state.lyric.length - 1);
            return state.selectIndex === selectIndex ? state : Object.assign(Object.assign({}, state), { selectIndex });
        }
        case 5: {
            const { selectIndex, currentIndex } = state;
            let lyric = state.lyric;
            if (lyric[selectIndex].time !== undefined) {
                const newLyric = lyric.slice();
                newLyric[selectIndex] = { text: lyric[selectIndex].text };
                lyric = newLyric;
                let { currentTime, nextTime } = state;
                if (selectIndex === currentIndex) {
                    currentTime = Infinity;
                    nextTime = -Infinity;
                }
                return Object.assign(Object.assign({}, state), { lyric,
                    currentTime,
                    nextTime });
            }
            return state;
        }
        case 6: {
            action.payload(state);
            return state;
        }
    }
    return state;
};
const init = (lazyInit) => {
    const { text, options, select } = lazyInit();
    return Object.assign(Object.assign({}, parser(text, options)), { currentTime: Infinity, currentIndex: Infinity, nextTime: -Infinity, nextIndex: -Infinity, selectIndex: select });
};
export const useLrc = (lazyInit) => React.useReducer(reducer, lazyInit, init);
//# sourceMappingURL=useLrc.js.map