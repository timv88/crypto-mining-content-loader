import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import conditional from "rollup-plugin-conditional";

const isProduction = process.env.NODE_ENV.trim() === 'production';

const dest = `./public`;

export default {
    input: 'src/app.js',
    output: {
        file: `${dest}/js/bundle.js`,
        format: 'umd'
    },
    plugins: [
        sass({
            output: `${dest}/css/style.css`,
            sourceMap: false
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            // include: 'node_modules/**',
            sourceMap: false,
        }),
        conditional(!isProduction, [
            serve({
                open: true,
                contentBase: 'public',
                host: 'localhost',
                port: 10001
            }),
            livereload()
        ])
    ]
};
