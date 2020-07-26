import { Widget } from './Widget';
import { ApplicationFrame } from './ApplicationFrame';

export abstract class Scene
{
    content: Widget;

    private applicationFrame: ApplicationFrame;

    onCreate(): void
    {
        // OVERRIDE
    }

    onPause(): void
    {
        // OVERRIDE
    }

    onResume(): void
    {
        // OVERRIDE
    }

    onDestroy(): void
    {
        // OVERRIDE
    }

    create(applicationFrame: ApplicationFrame): void
    {
        this.applicationFrame = applicationFrame;

        this.onCreate();
    }

    pause(): void
    {
        this.onPause();
    }

    resume(): void
    {
        this.onResume();
    }

    destroy(): void
    {
        this.onDestroy();
    }

    setContent(widget: Widget): this
    {
        this.content = widget;

        return this;
    }
}
