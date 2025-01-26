describe('Testing performance related functions', () => {
    test('A test on performance', () => {
        const start = performance.now();

        // Code to be tested

        const end = performance.now();
        console.log('Time elapsed: ', end - start);
    });
});
