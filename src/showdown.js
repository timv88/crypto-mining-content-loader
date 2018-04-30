import showdown from 'showdown';

const classMap = {
    ul: 'browser-default',
}

const bindings = Object.keys(classMap).map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}>`, 'g'),
    replace: `<${key} class="${classMap[key]}">`
}));

const conv = new showdown.Converter({
    parseImgDimension: true,
    extensions: [...bindings],
    noHeaderId: true // needed for regex match
});

export default markup => {
    if (!markup) {
        console.error("no markup specified in transform");
        return;
    }
    return conv.makeHtml(markup);
};
