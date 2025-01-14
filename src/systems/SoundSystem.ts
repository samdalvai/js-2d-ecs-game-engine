import AssetStore from '../asset-store/AssetStore';
import ExplosionOnDeathComponent from '../components/ExplosionOnDeathComponent';
import SoundComponent from '../components/SoundComponent';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import EntityKilledEvent from '../events/EntityKilledEvent';

export default class SoundSystem extends System {
    assetStore: AssetStore;

    constructor(assetStore: AssetStore) {
        super();
        this.requireComponent(SoundComponent);
        this.assetStore = assetStore;
    }

    subscribeToEvents = (eventBus: EventBus) => {
        eventBus.subscribeToEvent(EntityKilledEvent, this, this.onEntityKilled);
    };

    onEntityKilled = (event: EntityKilledEvent) => {
        const entity = event.entity;

        if (entity.hasComponent(ExplosionOnDeathComponent)) {
            const explosion = entity.getComponent(ExplosionOnDeathComponent);

            if (!explosion) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const explosionSound = this.assetStore.getSound('explosion-big');

            if (!explosionSound) {
                throw new Error('Could not find explosion sound');
            }

            explosionSound.play();
        }
    };

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
