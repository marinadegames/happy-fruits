import { AudioClip, AudioSource, Node } from 'cc';
import { System } from 'db://assets/scripts/ecs/System';

export class SoundSystem extends System {
    private audioPlayers: Map<string, AudioSource> = new Map();
    private clips: Map<string, AudioClip> = new Map();

    constructor(audioClips: AudioClip[]) {
        super();
        audioClips.forEach((clip) => this.clips.set(clip.name, clip));
    }

    update() {}

    public play(clipName: string, loop = false, volume = 1) {
        const clip = this.clips.get(clipName);
        if (!clip) {
            console.error(`Sound not found: ${clipName}`);
            return;
        }

        const node = new Node(`Audio_${clipName}`);
        const source = node.addComponent(AudioSource);
        source.clip = clip;
        source.loop = loop;
        source.volume = volume;
        source.play();

        this.audioPlayers.set(clipName, source);

        if (!loop) {
            source.node.once(AudioSource.EventType.ENDED, () => {
                this.audioPlayers.delete(clipName);
                node.destroy();
            });
        }
    }

    public stop(clipName: string) {
        const source = this.audioPlayers.get(clipName);
        if (source) {
            source.stop();
            source.node.destroy();
            this.audioPlayers.delete(clipName);
        }
    }

    // todo: use for mute all sounds (future)
    public stopAll() {
        for (const [name, source] of this.audioPlayers) {
            source.stop();
            source.node.destroy();
        }
        this.audioPlayers.clear();
    }
}
