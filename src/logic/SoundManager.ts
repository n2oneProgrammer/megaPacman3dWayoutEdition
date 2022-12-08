export default class SoundManager {
    private static _instance: SoundManager | null = null;
    private audio: HTMLAudioElement | null = null;

    public static get instance() {
        if (SoundManager._instance == null) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance
    }

    play(src: string, isLoop: boolean = false) {
        if (this.audio != null) {
            this.audio.pause();
        }
        this.audio = new Audio(src);
        this.audio.loop = isLoop;
        this.audio.play();
    }

    stop() {
        if (this.audio != null) {
            this.audio.pause();
        }
        this.audio = null;
    }
}
