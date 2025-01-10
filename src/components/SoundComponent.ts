import Component from '../ecs/Component';

export default class SoundComponent extends Component {
    assetId: string;
    loop: boolean;
    isPlaying: boolean;

    constructor(assetId = '', lopp = false) {
        super();
        this.assetId = assetId;
        this.loop = lopp;
        this.isPlaying = false;
    }
}
