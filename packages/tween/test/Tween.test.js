const expect = require('chai').expect;
const PIXI = require('pixi.js');
const {
    EaseBoth,
    NumberErp,
    PointErp,
    TweenManager,
} = require('../lib/puxi-tween.cjs');

describe('Tween', () =>
{
    const mockManager = new TweenManager();

    it('Target property is updated', () =>
    {
        const mockTarget = { position: new PIXI.Point(-25, 50) };

        return new Promise((resolve) =>
        {
            mockManager.tween(
                mockTarget.position.clone(),
                new PIXI.Point(50, 105),
                50,
                PointErp,
                EaseBoth,
            ).target(
                mockTarget,
                'position',
            ).on('complete', () =>
            {
                expect(mockTarget.position.x).to.equal(50);
                expect(mockTarget.position.y).to.equal(105);

                resolve();
            });
        });
    });

    it('Repetition works and cycle event is fired', () =>
        (
            new Promise((resolve) =>
            {
                let cycle = 0;

                mockManager.tween(
                    0, 100, 25, NumberErp,
                ).repeat(
                    2,
                    false,
                ).on('cycle', (tween) =>
                {
                    ++cycle;
                    expect(tween.observedValue).to.equal(100);

                    if (cycle == 2)
                    {
                        resolve();
                    }
                });
            })
        ));

    it('Chained tween also runs to completion', () =>
        new Promise((resolve) => mockManager.tween(
            0, 100, 25, NumberErp,
        ).chain(
            25, 0, 25, NumberErp,
        ).on('complete', () =>
        {
            expect(true);
            resolve();
        },
        )));
});
