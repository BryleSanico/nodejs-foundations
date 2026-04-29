// parallel.js

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Part A - Sequential
async function sequential() {
    console.time('Sequential');
    await wait(1000);
    await wait(1000);
    await wait(1000);
    console.timeEnd('Sequential');
}

// Part B - Parallel
async function parallel() {
    console.time('Parallel');
    await Promise.all([wait(1000), wait(1000), wait(1000)]);
    console.timeEnd('Parallel');
}

async function main() {
    await sequential();
    await parallel();
}

main(); 