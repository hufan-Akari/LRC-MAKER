import { AudioActionType, audioStatePubSub } from "../utils/audiomodule.js";
import { CloseSVG } from "./svg.js";

const { useRef, useEffect, useCallback } = React;

interface ILoadAudioDialogRef extends React.RefObject<HTMLDialogElement> {
    open: boolean;
    showModal: () => void;
    close: () => void;
}

let supportDialog = (window as any).HTMLDialogElement !== undefined;

export const loadAudioDialogRef: ILoadAudioDialogRef = {
    current: null,
    get open() {
        return this.current ? this.current.open : false;
    },
    showModal() {
        if (this.current === null || this.current.open) {
            return;
        }
        if (!supportDialog) {
            dialogPolyfill.registerDialog(loadAudioDialogRef.current!);
            supportDialog = true;
        }

        this.current.showModal();
    },
    close() {
        if (this.current === null || !this.current.open) {
            return;
        }
        this.current.close();
    },
};

interface ILoadAudioOptions {
    setAudioSrc: (src: string) => void;
    lang: Language;
}

export const LoadAudio: React.FC<ILoadAudioOptions> = ({
    setAudioSrc,
    lang,
}) => {
    const self = useRef(Symbol(LoadAudio.name));

    useEffect(() => {
        audioStatePubSub.sub(self.current, (data) => {
            if (data.type === AudioActionType.getDuration) {
                loadAudioDialogRef.close();
            }
        });
        return () => {
            audioStatePubSub.unsub(self.current);
        };
    }, []);

    const onClose = useCallback(() => {
        loadAudioDialogRef.close();
    }, []);

    const onSubmit = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const form = ev.target as HTMLFormElement;

        const urlInput = form.elements.namedItem("url")! as HTMLInputElement;

        let url = urlInput.value;

        if (url.includes("music.163.com")) {
            const result = url.match(/\d{4,}/);
            if (result !== null) {
                const id = result[0];
                url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            }
        }

        sessionStorage.setItem(SSK.audioSrc, url);
        setAudioSrc(url);
    }, []);

    return ReactDOM.createPortal(
        <dialog ref={loadAudioDialogRef} className="fixed app-loadaudio-dialog">
            <button className="glow loadaudio-dialog-close" onClick={onClose}>
                <CloseSVG />
            </button>
            <div className="dialog-tab loadaudio-via-file">
                <input
                    type="radio"
                    name="tabgroup"
                    id="tab-file"
                    defaultChecked
                />
                <label className="ripple" htmlFor="tab-file">
                    {lang.loadAudio.file}
                </label>
                <div className="content">
                    <label className="audio-input-tip" htmlFor="audio-input">
                        {lang.loadAudio.loadFile}
                    </label>
                </div>
            </div>

            <div className="dialog-tab loadaudio-via-url">
                <input type="radio" name="tabgroup" id="tab-url" />
                <label className="ripple" htmlFor="tab-url">
                    {lang.loadAudio.url}
                </label>
                <div className="content">
                    <form className="audio-input-form" onSubmit={onSubmit}>
                        <input
                            type="url"
                            name="url"
                            required
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                        <input className="button" type="submit" />
                    </form>
                </div>
            </div>
        </dialog>,
        document.body,
    );
};
