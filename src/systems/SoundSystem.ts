import AssetStore from '../asset-store/AssetStore';
import SoundComponent from '../components/SoundComponent';
import System from '../ecs/System';

export default class SoundSystem extends System {
    constructor() {
        super();
        this.requireComponent(SoundComponent);
    }

    async update(assetStore: AssetStore) {
        for (const entity of this.getSystemEntities()) {
            const sound = entity.getComponent(SoundComponent);

            if (!sound) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            if (sound.isPlaying) {
                continue; // Skip if the sound is already playing
            }

            const soundTrack = assetStore.getSound(sound.assetId);

            if (!soundTrack) {
                throw new Error(`Sound asset with ID ${sound.assetId} not found.`);
            }

            if (sound.loop) {
                soundTrack.loop = true;
            }

            try {
                // Attempt to play the sound and wait for it to start
                await soundTrack.play();
                sound.isPlaying = true; // Mark as playing only after successful playback
            } catch (error) {
                console.error(`Failed to play sound: ${error}`);
            }
        }
    }
}