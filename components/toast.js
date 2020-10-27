import { createPubSub } from "../utils/pubsub.js";
import { CheckSVG, InfoSVG, ProblemSVG } from "./svg.js";
export const toastPubSub = createPubSub();
const { useCallback, useEffect, useRef, useState } = React;
const box = { id: 0 };
export const Toast = () => {
    const self = useRef(Symbol(Toast.name));
    const [toastQueue, setToastQueue] = useState([]);
    useEffect(() => {
        toastPubSub.sub(self.current, (data) => {
            setToastQueue((queue) => [Object.assign({ id: box.id++ }, data), ...queue]);
        });
    }, []);
    const onAnimationEnd = useCallback((ev) => {
        if (ev.animationName === "slideOutRight") {
            setToastQueue((queue) => queue.slice(0, -1));
        }
    }, []);
    const ToastIter = useCallback((toast) => {
        const badge = {
            info: React.createElement(InfoSVG, null),
            success: React.createElement(CheckSVG, null),
            warning: React.createElement(ProblemSVG, null),
        }[toast.type];
        return (React.createElement("section", { className: "toast", key: toast.id },
            React.createElement("section", { className: `toast-badge toast-${toast.type}` }, badge),
            React.createElement("section", { className: "toast-text" }, toast.text)));
    }, []);
    return (React.createElement("div", { className: "toast-queue", onAnimationEnd: onAnimationEnd }, toastQueue.map(ToastIter)));
};
//# sourceMappingURL=toast.js.map