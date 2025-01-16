import AssetStore from '../asset-store/AssetStore';
import ExplosionOnDeathComponent from '../components/ExplosionOnDeathComponent.js';
import ExplosionOnHitComponent from '../components/ExplosionOnHitComponent.js';
import SoundComponent from '../components/SoundComponent.js';
import System from '../ecs/System.js';
import EventBus from '../event-bus/EventBus.js';
import EntityHitEvent from '../events/EntityHitEvent.js';
import EntityKilledEvent from '../events/EntityKilledEvent.js';

export default class SoundSystem extends System {
    assetStore: AssetStore;

    constructor(assetStore: AssetStore) {
        super();
        this.requireComponent(SoundComponent);
        this.assetStore = assetStore;
    }

    subscribeToEvents = (eventBus: EventBus) => {
        eventBus.subscribeToEvent(EntityKilledEvent, this, this.onEntityKilled);
        eventBus.subscribeToEvent(EntityHitEvent, this, this.onEntityHit);
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

            if (explosionSound.currentTime !== 0) {
                explosionSound.currentTime = 0;
            }

            explosionSound.volume = 0.25;
            explosionSound.play().catch(error => console.error(`Failed to play sound: ${error}`));
        }
    };

    onEntityHit = (event: EntityHitEvent) => {
        const entity = event.entity;

        if (entity.hasComponent(ExplosionOnHitComponent)) {
            const explosion = entity.getComponent(ExplosionOnHitComponent);

            if (!explosion) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const explosionSound = this.assetStore.getSound('explosion-small');

            if (!explosionSound) {
                throw new Error('Could not find explosion sound');
            }

            if (explosionSound.currentTime !== 0) {
                explosionSound.currentTime = 0;
            }

            explosionSound.volume = 0.25;
            explosionSound.play().catch(error => console.error(`Failed to play sound: ${error}`));
        }
    };

    async update(assetStore: AssetStore) {
        for (const entity of this.getSystemEntities()) {
            const sound = entity.getComponent(SoundComponent);

            if (!sound) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const soundTrack = assetStore.getSound(sound.assetId);

            if (!soundTrack) {
                throw new Error(`Sound asset with ID ${sound.assetId} not found.`);
            }

            if (soundTrack.currentTime === 0) {
                soundTrack.volume = sound.volume;
                soundTrack.play().catch(error => console.error(`Failed to play sound: ${error}`));
            }

            if (soundTrack.currentTime >= soundTrack.duration - sound.offsetBuffer) {
                soundTrack.currentTime = 0;
            }
        }
    }
}
