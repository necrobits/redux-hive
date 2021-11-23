function wrap(forkEffect: any) {
    return function* () {
        yield forkEffect;
    }
}

export function createSagaFromFork(...args: any[]) {
    return args.map(wrap);
}