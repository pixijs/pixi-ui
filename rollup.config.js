/* eslint-env node */

import path from 'path';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { getPackages } from '@lerna/project';
import filterPackages from '@lerna/filter-packages';
import batchPackages from '@lerna/batch-packages';

async function getSortedPackages(scope, ignore)
{
    const packages = await getPackages(__dirname);
    const filtered = filterPackages(
        packages,
        scope,
        ignore,
        false,
    );

    return batchPackages(filtered)
        .reduce((arr, batch) => arr.concat(batch), []);
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
        '@pixi/filter-drop-shadow': '__filters',
    };

    const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
    const results = [];

    const packages = await getSortedPackages();

    packages.forEach((pkg) =>
    {
        let banner = [
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
            namespace,
        } = pkg.toJSON();

        results.push({
            input,
            output: [
                {
                    banner: `${banner}\n// cjs`,
                    file: path.join(basePath, main),
                    format: 'cjs',
                    sourcemap: true,
                    freeze: false,
                    globals,
                },
                {
                    banner: `${banner}\n// mjs`,
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
            const ns = namespace || 'PUXI';
            const name = pkg.name.replace(/[^a-z]+/g, '_');

            if (ns.includes('.'))
            {
                // Base namespace (PUXI)
                const baseNs = ns.split('.')[0];

                // this.PUXI = this.PUXI || {} - initialize PUXI if not yet
                banner += `\nthis.${baseNs} = this.${baseNs} || {};`;
            }

            // this.PUXI.tween = this.PUXI.tween || {} - initialize ns if not yet
            banner += `\nthis.${ns} = this.${ns} || {};`;

            // Inject module into its namespace
            const footer = `Object.assign(this.${ns}, ${name})`;

            results.push({
                input,
                output: [
                    {
                        banner,
                        name,
                        file,
                        format: 'iife',
                        sourcemap: true,
                        globals,
                        footer,
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
                        name,
                        file: file.replace(/\.js$/, '.min.js'),
                        format: 'iife',
                        sourcemap: true,
                        globals,
                        footer,
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
