/**
 * A file loading function for CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file, loaderFunc = d3.csv) {
    let data = await loaderFunc(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +KeyboardEvent;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}