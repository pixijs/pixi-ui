import { Stage } from './Stage';
import { Scene } from './Scene';

interface IApplicationFrameOptions
{
    width: number;
    height: number;
}

/**
 * The application frame provides a robust interface for managing widget state,
 * creating modals.
 *
 * @memberof PUXI
 */
export class ApplicationFrame extends Stage
{
    protected sceneInstances: Map<string, Scene>;
    protected currentScene: Scene;

    constructor(options: IApplicationFrameOptions)
    {
        super(options.width, options.height);

        /**
         * The instances of all the scenes created.
         */
        this.sceneInstances = new Map<string, Scene>();

        this.currentScene = null;
    }

    /**
     * Sets the current scene displayed in the application.
     *
     * @param SceneClass
     * @param id
     */
    setScene(SceneClass: { new(): Scene; name: string }, id = SceneClass.name): void
    {
        let sceneInstance = this.sceneInstances.get(id);

        if (!sceneInstance)
        {
            sceneInstance = new SceneClass();
            sceneInstance.create(this);

            this.sceneInstances.set(id, sceneInstance);
        }

        if (this.currentScene === sceneInstance)
        {
            return;
        }
        if (this.currentScene)
        {
            this.currentScene.pause();
        }

        // eslint-disable-next-line
        // @ts-ignore
        this.removeChild(...this.widgetChildren);

        this.currentScene = sceneInstance;
        this.currentScene.resume();

        this.addChild(this.currentScene.content);
    }
}
