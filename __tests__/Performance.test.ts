describe('Testing performance related functions', () => {
    enum Test {
        TEST_1,
        TEST_2,
    }

    test('A test on performance', () => {
        const times: number[] = [];

        for (let x = 0; x < 10; x++) {
            const start = performance.now();

            // Code to be tested
            let a = 0;
            for (let i = 0; i < 1000000; i++) {
                if (Test.TEST_1 === Test.TEST_1) {
                    a++;
                }
            }

            const end = performance.now();
            times.push(end - start);
        }

        let sum = 0;
        for (let x = 0; x < times.length; x++) {
            sum += times[x];
        }
        console.log('Time elapsed: ' + sum / times.length + ' seconds');
    });
});
