// async-evolution.js


// Version 1: Callbacks (old style)
function fetchUserCallback(id, callback) {
    setTimeout(() => {
        callback(null, { id: id, name: 'Ana' });
    }, 1000);
}

fetchUserCallback(1, (err, user) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Callback:', user);
    }
});


// Version 2: Promises (modern style)
function fetchUserPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ id: id, name: 'Ana' });
        }, 1000);
    });
}

fetchUserPromise(2)
    .then(user => console.log('Promise:', user))
    .catch(err => console.error(err));


// Version 3: Async/Await (latest style - what you should write/use)
async function main() {
    try {
        const user = await fetchUserPromise(3);
        console.log('Async/Await result:', user);
    } catch (err) {
        console.error(err);
    }
}

main();