import { info, themeColor } from "../hooks/usePref.js";
import { convertTimeToTag, formatText } from "../lrc-parser.js";
import { unregister } from "../utils/sw.unregister.js";
import { appContext } from "./app.context.js";
import { AkariHideWall } from "./svg.img.js";
const { useCallback, useContext, useEffect, useMemo, useRef } = React;
const numberInputProps = { type: "number", step: 1 };
const useNumberInput = (defaultValue, onChange) => {
    const ref = useRef(null);
    useEffect(() => {
        const target = ref.current;
        if (target) {
            const onChange = () => {
                target.value = defaultValue.toString();
            };
            target.addEventListener("change", onChange);
            return () => target.removeEventListener("change", onChange);
        }
    }, [defaultValue]);
    const $onChange = useCallback((ev) => {
        if (ev.target.validity.valid) {
            onChange(ev);
        }
    }, [onChange]);
    return Object.assign(Object.assign({}, numberInputProps), { ref, onChange: $onChange, defaultValue });
};
export const Preferences = () => {
    const { prefState, prefDispatch, lang } = useContext(appContext, 1 || 4);
    const onColorPick = useCallback((ev) => {
        prefDispatch({
            type: "themeColor",
            payload: ev.target.value,
        });
    }, [prefDispatch]);
    const userColorInputText = useRef(null);
    const onUserInput = useCallback((input) => {
        let value = input.value;
        if (!input.validity.valid) {
            input.value = input.defaultValue;
            return;
        }
        if (value.length === 3) {
            value = [].map.call(value, (v) => v + v).join("");
        }
        if (value.length < 6) {
            value = value.padEnd(6, "0");
        }
        prefDispatch({
            type: "themeColor",
            payload: "#" + value,
        });
    }, [prefDispatch]);
    const onUserColorInputBlur = useCallback((ev) => onUserInput(ev.target), [
        onUserInput,
    ]);
    const onColorSubmit = useCallback((ev) => {
        ev.preventDefault();
        const form = ev.target;
        const input = form.elements.namedItem("user-color-input-text");
        return onUserInput(input);
    }, [onUserInput]);
    useEffect(() => {
        userColorInputText.current.value = prefState.themeColor.slice(1);
    }, [prefState.themeColor]);
    const onSpaceChange = useCallback((ev) => {
        prefDispatch({
            type: ev.target.name,
            payload: ev.target.value,
        });
    }, [prefDispatch]);
    const onCacheClear = useCallback(() => {
        unregister();
    }, []);
    const updateTime = useMemo(() => {
        const date = new Date("2021-01-20T21:51:56+08:00");
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
            hour12: false,
        };
        return new Intl.DateTimeFormat(prefState.lang, options).format(date);
    }, [prefState.lang]);
    const onLangChanged = useCallback((ev) => {
        prefDispatch({
            type: "lang",
            payload: ev.target.value,
        });
    }, [prefDispatch]);
    const onBuiltInAudioToggle = useCallback(() => prefDispatch({
        type: "builtInAudio",
        payload: (prefState) => !prefState.builtInAudio,
    }), [prefDispatch]);
    const onScreenButtonToggle = useCallback(() => prefDispatch({
        type: "screenButton",
        payload: (prefState) => !prefState.screenButton,
    }), [prefDispatch]);
    const onThemeModeChange = useCallback((ev) => {
        prefDispatch({
            type: "themeMode",
            payload: Number.parseInt(ev.target.value, 10),
        });
    }, [prefDispatch]);
    const onFixedChanged = useCallback((ev) => {
        prefDispatch({
            type: "fixed",
            payload: Number.parseInt(ev.target.value, 10),
        });
    }, [prefDispatch]);
    const LangOptionList = useMemo(() => {
        return Object.entries(info.languages).map(([langCode, langName]) => {
            return (React.createElement("option", { key: langCode, value: langCode }, langName));
        });
    }, []);
    const ColorPickerWall = useMemo(() => {
        return Object.values(themeColor).map((color) => {
            const checked = color === prefState.themeColor;
            const classNames = ["color-picker", "ripple"];
            if (checked) {
                classNames.push("checked");
            }
            return (React.createElement("label", { className: classNames.join(" "), key: color, style: { backgroundColor: color } },
                React.createElement("input", { hidden: true, type: "radio", name: "theme-color", value: color, checked: checked, onChange: onColorPick })));
        });
    }, [onColorPick, prefState.themeColor]);
    const currentThemeColorStyle = useMemo(() => {
        return {
            backgroundColor: prefState.themeColor,
        };
    }, [prefState.themeColor]);
    const formatedText = useMemo(() => {
        return formatText("   hello   世界～   ", prefState.spaceStart, prefState.spaceEnd);
    }, [prefState.spaceStart, prefState.spaceEnd]);
    const userColorLabel = useRef(null);
    const userColorInput = useRef(null);
    useEffect(() => {
        if (userColorInput.current.type === "color") {
            userColorLabel.current.removeAttribute("for");
        }
    }, []);
    return (React.createElement("div", { className: "preferences" },
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.version),
                    React.createElement("span", { className: "select-all" }, "5.4.10"))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.commitHash),
                    React.createElement("span", { className: "select-all" }, "7c1d824"))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.updateTime),
                    React.createElement("span", null, updateTime))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.repo),
                    React.createElement("a", { className: "link", href: "https://github.com/magic-akari/lrc-maker", target: "_blank", rel: "noopener noreferrer" }, "Github"))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.help),
                    React.createElement("a", { className: "link", href: "https://github.com/magic-akari/lrc-maker/wiki", target: "_blank", rel: "noopener noreferrer" }, "Github Wiki"))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.language),
                    React.createElement("div", { className: "option-select" },
                        React.createElement("select", { value: prefState.lang, onChange: onLangChanged, "aria-label": lang.preferences.language }, LangOptionList)))),
            React.createElement("li", null,
                React.createElement("label", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.builtInAudio),
                    React.createElement("label", { className: "toggle-switch" },
                        React.createElement("input", { type: "checkbox", checked: prefState.builtInAudio, onChange: onBuiltInAudioToggle, "aria-label": lang.preferences.builtInAudio }),
                        React.createElement("span", { className: "toggle-switch-label" })))),
            React.createElement("li", null,
                React.createElement("label", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.spaceButton),
                    React.createElement("label", { className: "toggle-switch" },
                        React.createElement("input", { type: "checkbox", checked: prefState.screenButton, onChange: onScreenButtonToggle, "aria-label": lang.preferences.spaceButton }),
                        React.createElement("span", { className: "toggle-switch-label" })))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.themeMode.label),
                    React.createElement("div", { className: "option-select" },
                        React.createElement("select", { name: "theme-mode", value: prefState.themeMode, onChange: onThemeModeChange, "aria-label": lang.preferences.themeMode.label },
                            React.createElement("option", { value: 0 }, lang.preferences.themeMode.auto),
                            React.createElement("option", { value: 1 }, lang.preferences.themeMode.light),
                            React.createElement("option", { value: 2 }, lang.preferences.themeMode.dark))))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.themeColor),
                    React.createElement("details", { className: "dropdown" },
                        React.createElement("summary", null,
                            React.createElement("span", { className: "color-picker ripple hash", style: currentThemeColorStyle }, "#"),
                            React.createElement("span", { className: "current-theme-color" }, prefState.themeColor.slice(1))),
                        React.createElement("form", { className: "dropdown-body color-wall", onSubmit: onColorSubmit },
                            ColorPickerWall,
                            React.createElement("label", { className: "color-picker ripple user-color-label hash", htmlFor: "user-color-input-text", style: currentThemeColorStyle, ref: userColorLabel },
                                "#",
                                React.createElement("input", { type: "color", className: "color-picker pseudo-hidden", value: prefState.themeColor, onChange: onColorPick, ref: userColorInput })),
                            React.createElement("input", { ref: userColorInputText, id: "user-color-input-text", name: "user-color-input-text", className: "user-color-input-text", type: "text", pattern: "[\\da-f]{3,6}", required: true, autoCapitalize: "none", autoComplete: "off", autoCorrect: "off", spellCheck: false, defaultValue: prefState.themeColor.slice(1), onBlur: onUserColorInputBlur }))))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.lrcFormat),
                    React.createElement("span", null,
                        React.createElement("time", { className: "format-example-time" }, convertTimeToTag(83.456, prefState.fixed)),
                        React.createElement("span", { className: "format-example-text" }, formatedText)))),
            React.createElement("li", null,
                React.createElement("section", { className: "list-item" },
                    React.createElement("span", null, lang.preferences.fixed),
                    React.createElement("div", { className: "option-select" },
                        React.createElement("select", { name: "fixed", value: prefState.fixed, onChange: onFixedChanged, "aria-label": lang.preferences.lrcFormat },
                            React.createElement("option", { value: 0 }, "0"),
                            React.createElement("option", { value: 1 }, "1"),
                            React.createElement("option", { value: 2 }, "2"),
                            React.createElement("option", { value: 3 }, "3"))))),
            React.createElement("li", null,
                React.createElement("label", { className: "list-item" },
                    React.createElement("label", { htmlFor: "space-start" }, lang.preferences.leftSpace),
                    React.createElement("input", Object.assign({ name: "spaceStart", id: "space-start", required: true, min: -1 }, useNumberInput(prefState.spaceStart, onSpaceChange))))),
            React.createElement("li", null,
                React.createElement("label", { className: "list-item" },
                    React.createElement("label", { htmlFor: "space-end" }, lang.preferences.rightSpace),
                    React.createElement("input", Object.assign({ name: "spaceEnd", id: "space-end", required: true, min: -1 }, useNumberInput(prefState.spaceEnd, onSpaceChange))))),
            React.createElement("li", { className: "ripple", onTransitionEnd: onCacheClear },
                React.createElement("section", { className: "list-item" }, lang.preferences.clearCache))),
        React.createElement(AkariHideWall, null)));
};
//# sourceMappingURL=preferences.js.map