import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';

export default [
    {
        input: 'lib/index.js',
        output: {
            format: 'umd',
            name: 'PUXI',
            file: 'bin/pixi-ui.js',
            sourcemap: true,
            globals: {
                'pixi.js': 'PIXI',
            },
        },
        external: ['pixi.js'],
        plugins: [
            commonjs(),
            resolve(),
            builtins(),
        ],
    },
    {
        input: 'lib/index.js',
        output: {
            format: 'umd',
            name: 'PUXI',
            file: 'bin/pixi-ui.min.js',
            sourcemap: true,
            globals: {
                'pixi.js': 'PIXI',
            },
        },
        external: ['pixi.js'],
        plugins: [
            terser(),
            commonjs(),
            resolve(),
            builtins(),
        ],
    },
];

