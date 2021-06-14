const fs = require('fs/promises');
const createFolderIsExist = require('../helpers/create-dir');

jest.mock('fs/promises');

describe('Unit test create-dir.js', () => {
    fs.mkdir = jest.fn(() => { });
    it('run function', async (done) => {
        fs.access = jest.fn().mockImplementation(() => Promise.resolve(true));
        await createFolderIsExist('test-unit');
        done();
    });
    it('run function', async (done) => {
        fs.access = jest.fn().mockImplementation(() => Promise.reject(false));
        await createFolderIsExist('test-unit');
        done();
    });
});