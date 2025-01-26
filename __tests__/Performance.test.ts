describe('Testing performance related functions', () => {
    enum Test {
        TEST1,
        TEST2,
    }

    const myMapEnum = new Map<Test, string>();

    myMapEnum.set(Test.TEST1, 'Hello1');
    myMapEnum.set(Test.TEST2, 'Hello2');

    const myMapString = new Map<string, string>();

    myMapString.set('test1', 'Hello1');
    myMapString.set('test2', 'Hello2');

    const myMapInts = new Map<number, string>();

    myMapInts.set(1, 'Hello1');
    myMapInts.set(2, 'Hello2');

    test('A test on performance', () => {
        const times: number[] = [];

        for (let x = 0; x < 10; x++) {
            const start = performance.now();

            // Code to be tested
            for (let i = 0; i < 100000000; i++) {
                // myMapEnum.get(Test.TEST1);
                // myMapEnum.get(Test.TEST2);

                myMapString.get('string1');
                myMapString.get('string2');

                // myMapInts.get(1);
                // myMapInts.get(2);
            }

            const end = performance.now();
            times.push(end - start);
        }

        let sum = 0;
        for (let x = 0; x < times.length; x++) {
            sum += times[x];
        }
        console.log('Time elapsed: ' + sum / times.length + ' ms');
    });
});
