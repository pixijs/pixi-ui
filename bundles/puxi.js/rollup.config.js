import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import multi from '@rollup/plugin-multi-entry';

export default [
    {
        input: 'src/index.js',
        output: {
            format: 'umd',
            name: 'PUXI',
            file: 'dist/puxi.js',
            sourcemap: true,
            globals: {
                'pixi.js': 'PIXI',
                '@pixi/filter-drop-shadow': 'PIXI.filters',
            },
        },
        external: ['pixi.js', '@pixi/filter-drop-shadow'],
        plugins: [
            commonjs(),
            resolve(),
            builtins(),
            multi(),
        ],
    },
    {
        input: 'src/index.js',
        output: {
            format: 'umd',
            name: 'PUXI',
            file: 'dist/puxi.min.js',
            sourcemap: true,
            globals: {
                'pixi.js': 'PIXI',
                '@pixi/filter-drop-shadow': 'PIXI.filters',
            },
        },
        external: ['pixi.js', '@pixi/filter-drop-shadow'],
        plugins: [
            terser(),
            commonjs(),
            resolve(),
            builtins(),
            multi(),
        ],
    },
];

