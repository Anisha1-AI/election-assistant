const assert = require('assert');

// Mock browser globals for Node.js environment
global.document = {
    documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} } },
    getElementById: () => ({ 
        addEventListener: () => {}, 
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        style: {} 
    }),
    addEventListener: () => {},
    querySelectorAll: () => {
        return { forEach: () => {} };
    }
};
global.window = {
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    scrollToSection: () => {}
};
global.localStorage = { getItem: () => null, setItem: () => {}, theme: '' };
global.fetch = () => Promise.resolve({ json: () => Promise.resolve({}) });
global.navigator = { share: null, clipboard: { writeText: () => Promise.resolve() } };

const { checkEligibilityLogic, validateAge, isEligibleUser } = require('./script');

assert.strictEqual(checkEligibilityLogic(18), true);
assert.strictEqual(checkEligibilityLogic(25), true);
assert.strictEqual(checkEligibilityLogic(17), false);
assert.strictEqual(checkEligibilityLogic(0), false);
assert.strictEqual(checkEligibilityLogic(-5), false);

assert.strictEqual(validateAge(25), true);
assert.strictEqual(validateAge(-1), false);
assert.strictEqual(validateAge(200), false);
assert.strictEqual(validateAge(0), true);
assert.strictEqual(validateAge(120), true);
assert.strictEqual(validateAge(18.5), false);

assert.strictEqual(isEligibleUser(18), true);
assert.strictEqual(isEligibleUser(17), false);
assert.strictEqual(isEligibleUser(-1), false);

console.log("All tests passed!");

