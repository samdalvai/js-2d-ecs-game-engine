import Component from '../ecs/Component';

export default class SpriteComponent extends Component {
    assetId: string;
    width: number;
    height: number;
    zIndex: number;

    constructor(assetId: string = '', width: number = 0, height: number = 0, zIndex: number = 0) {
        super();
        this.assetId = assetId;
        this.width = width;
        this.height = height;
        this.zIndex = zIndex;
    }
}

/*
std::string assetId;
    int width;
    int height;
    int zIndex;
    SDL_RendererFlip flip;
    bool isFixed;
    SDL_Rect srcRect;
    
    SpriteComponent(std::string assetId = "", int width = 0, int height = 0, int zIndex = 0, bool isFixed = false, int srcRectX = 0, int srcRectY = 0) {
        this->assetId = assetId;
        this->width = width;
        this->height = height;
        this->zIndex = zIndex;
        this->flip = SDL_FLIP_NONE;
        this->isFixed = isFixed;
        this->srcRect = {srcRectX, srcRectY, width, height};
    }*/
