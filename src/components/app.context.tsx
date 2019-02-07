import { useLang } from "../hooks/useLang.js";
import {
    Action as PrefAction,
    State as PrefState,
    usePref,
} from "../hooks/usePref.js";

const { createContext, useEffect, useMemo } = React;

interface IAppContext {
    lang: Language;
    prefState: PrefState;
    prefDispatch: React.Dispatch<PrefAction>;
}

const enum Bits {
    lang,
    // lrcFormat,
    builtInAudio,
    // screenButton,
    // themeColor,
    prefState,
}

export const enum ChangBits {
    lang = 1 << Bits.lang,
    // lrcFormat = 1 << Bits.lrcFormat,
    builtInAudio = 1 << Bits.builtInAudio,
    // screenButton = 1 << Bits.screenButton,
    // themeColor = 1 << Bits.themeColor,
    prefState = 1 << Bits.prefState,
}

export const appContext = createContext<IAppContext>(
    undefined,
    (prev, next) => {
        let bits = 0;

        if (prev.lang !== next.lang) {
            bits |= ChangBits.lang;
        }

        // const changed = (prop: keyof IAppContext["prefState"]) => {
        //     return prev.prefState[prop] !== next.prefState[prop];
        // };

        // if (changed("spaceStart") || changed("spaceEnd") || changed("fixed")) {
        //     bits |= ChangBits.lrcFormat;
        // }

        // if (changed("builtInAudio")) {
        //     bits |= ChangBits.builtInAudio;
        // }
        // if (changed("screenButton")) {
        //     bits |= ChangBits.screenButton;
        // }

        // if (changed("themeColor")) {
        //     bits |= ChangBits.themeColor;
        // }

        if (prev.prefState.builtInAudio !== next.prefState.builtInAudio) {
            bits |= ChangBits.builtInAudio;
        }

        if (prev.prefState !== next.prefState) {
            bits |= ChangBits.prefState;
        }

        return bits;
    },
);

export const AppProvider: React.FC = ({ children }) => {
    const [prefState, prefDispatch] = usePref(
        localStorage.getItem(LSK.preferences) || Const.emptyString,
    );

    const [lang, setLang] = useLang();

    useEffect(
        () => {
            setLang(prefState.lang);
        },
        [prefState.lang],
    );

    useEffect(
        () => {
            document.title = lang.app.fullname;
            document.documentElement.lang = prefState.lang;
        },
        [lang],
    );

    useEffect(
        () => {
            document.documentElement.style.setProperty(
                "--theme-color",
                prefState.themeColor,
            );
        },
        [prefState.themeColor],
    );

    const value = useMemo(
        () => {
            return {
                lang,
                prefState,
                prefDispatch,
            };
        },
        [lang, prefState],
    );

    return <appContext.Provider value={value}>{children}</appContext.Provider>;
};
