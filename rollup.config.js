import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/app.js',
    output: {
        file: 'public/js/bundle.js',
        format: 'umd'
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            // include: 'node_modules/**',
            sourceMap: false,
        })
    ]
};