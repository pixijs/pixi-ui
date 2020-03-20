/**
 * @memberof PUXI
 * @class
 */
export class Insets
{
    left: number;
    top: number;
    right: number;
    bottom: number;

    dirtyId: number;

    constructor()
    {
        this.reset();
        this.dirtyId = 0;
    }

    reset(): void
    {
        this.left = -1;
        this.top = -1;
        this.right = -1;
        this.bottom = -1;
    }
}
