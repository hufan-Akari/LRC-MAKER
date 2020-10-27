"use strict";
const details = document.createElement("details");
const polyfilldetails = () => {
    const prototype = details.constructor.prototype;
    const openProperty = Object.getOwnPropertyDescriptor(prototype, "open");
    Object.defineProperties(prototype, {
        open: {
            get() {
                var _a;
                if (this.tagName === "DETAILS") {
                    return this.hasAttribute("open");
                }
                else {
                    return (_a = openProperty === null || openProperty === void 0 ? void 0 : openProperty.get) === null || _a === void 0 ? void 0 : _a.call(this);
                }
            },
            set(value) {
                var _a;
                if (this.tagName === "DETAILS") {
                    if (value !== this.hasAttribute("open")) {
                        const event = document.createEvent("Event");
                        event.initEvent("toggle", false, false);
                        this.dispatchEvent(event);
                    }
                    return value ? this.setAttribute("open", "") : this.removeAttribute("open");
                }
                else {
                    return (_a = openProperty === null || openProperty === void 0 ? void 0 : openProperty.set) === null || _a === void 0 ? void 0 : _a.call(this, value);
                }
            },
        },
    });
    document.addEventListener("click", (event) => {
        const element = event.target;
        const summary = element.closest("summary");
        const details = summary === null || summary === void 0 ? void 0 : summary.parentElement;
        if (!details || details.tagName !== "DETAILS") {
            return;
        }
        details.open = !details.open;
    });
};
if (!("open" in details)) {
    polyfilldetails();
}
//# sourceMappingURL=details-summary.js.map