import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import ts from 'rollup-plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';

export default [
    {
        input: 'src/index.ts',
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
            ts(),
            commonjs(),
            resolve(),
            builtins(),
        ],
    },
    {
        input: 'src/index.ts',
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
            ts(),
            commonjs(),
            resolve(),
            builtins(),
        ],
    },
];

