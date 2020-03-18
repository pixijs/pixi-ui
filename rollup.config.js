/* eslint-env node */

import path from 'path';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { getPackages } from '@lerna/project';

async function getSortedPackages()
{
    const packages = await getPackages();

    packages.sort((apkg, bpkg) =>
    {
        const a = apkg.name;
        const b = bpkg.name;

        if (a.charAt(0) === '@' && b.charAt(0) === '@')
        {
            return 0;
        }
        if (a.charAt(0) === '@')
        {
            return -1;
        }
        if (b.charAt(0) === '@')
        {
            return 1;
        }

        return 0;
    });

    return packages;
}

async function main()
{
    const plugins = [
        sourcemaps(),
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs({
            namedExports: {
                'resource-loader': ['Resource'],
            },
        }),
        typescript(),
    ];

    const external = ['pixi.js', '@pixi/filter-drop-shadow'];
    const globals = {
        'pixi.js': 'PIXI',
        '@pixi/filter-drop-shadow': 'PIXI.filtesr',
    };

    const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
    const results = [];

    const packages = await getSortedPackages();

    packages.forEach((pkg) =>
    {
        const banner = [
            `/*!`,
            ` * ${pkg.name} - v${pkg.version}`,
            ` * Compiled ${compiled}`,
            ` *`,
            ` * ${pkg.name} is licensed under the MIT License.`,
            ` * http://www.opensource.org/licenses/mit-license`,
            ` */`,
        ].join('\n');

        const basePath = path.relative(__dirname, pkg.location);
        const input = path.join(basePath, 'src/index.ts');

        const {
            main,
            module,
            bundle,
        } = pkg.toJSON();

        results.push({
            input,
            output: [
                {
                    banner,
                    file: path.join(basePath, main),
                    format: 'cjs',
                    sourcemap: true,
                    freeze: false,
                    globals,
                },
                {
                    banner,
                    file: path.join(basePath, module),
                    format: 'esm',
                    sourcemap: true,
                    freeze: false,
                    globals,
                },
            ],
            plugins,
            external,
        });

        if (bundle)
        {
            const file = path.join(basePath, bundle);

            results.push({
                input,
                output: [
                    {
                        banner,
                        name: 'PUXI',
                        file,
                        format: 'iife',
                        sourcemap: true,
                        globals,
                    },
                ],
                treeshake: false,
                plugins,
                external,
            });

            if (process.env.NODE_ENV === 'production')
            {
                results.push({
                    input,
                    output: [{
                        banner,
                        name: 'PUXI',
                        file: file.replace(/\.js$/, '.min.js'),
                        format: 'iife',
                        sourcemap: true,
                        globals,
                    }],
                    treeshake: false,
                    plugins: [
                        ...plugins,
                        terser({
                            output: {
                                comments: (node, comment) => comment.line === 1,
                            },
                        }),
                    ],
                    external,
                });
            }
        }
    });

    return results;
}

export default main();
