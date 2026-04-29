// my-promise.js

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

wait(2000).then(() => {
    console.log('Waited 2 seconds');
}).catch(err => {
    console.error(err);
});

async function main() {
    console.log('Waiting for 3 seconds...');
    try {
        await wait(3000);
        console.log('Done waiting!');
    } catch (err) {
        console.error(err);
    } 
}

main();