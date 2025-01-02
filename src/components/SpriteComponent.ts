import Component from '../ecs/Component';
import { Rect } from '../types';

// TODO: handle flipping images and rotation, if possible
export default class SpriteComponent extends Component {
    assetId: string;
    width: number;
    height: number;
    zIndex: number;
    srcRect: Rect;
    isFixed: boolean;

    constructor(
        assetId = '',
        width = 0,
        height = 0,
        zIndex = 0,
        srcRectX = 0,
        srcRectY = 0,
        isFixed = false,
    ) {
        super();
        this.assetId = assetId;
        this.width = width;
        this.height = height;
        this.zIndex = zIndex;
        this.srcRect = { x: srcRectX, y: srcRectY, width, height };
        this.isFixed = isFixed;
    }
}
