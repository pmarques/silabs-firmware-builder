const core = require("@actions/core");
const glob = require("@actions/glob");
const path = require('path');
const { omit, defaultsDeep } = require('lodash');

const objectToCSV = (obj) => {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    result.push(`${key}:${value}`);
  }
  return result.join(',');
};

async function main() {
    const jsonPath = path.join(process.env.GITHUB_WORKSPACE, core.getInput("path"));
    const defaults = require(`${jsonPath}/defaults.json`);

    const patterns = [`${jsonPath}/*.json`, `!${jsonPath}/defaults.json`];
    const globber = await glob.create(patterns.join('\n'));
    const files = await globber.glob();

    let fw = {};
    const types = ['ncp-uart-hw','rcp-uart-802154', 'ot-rcp'];
    for (const t of types){ fw[t] = []; }

    for (const file of files) {
        let obj = require(file);
        let manifest = defaultsDeep(obj, defaults);
        let base = omit(manifest, [...types, 'params']);

        for (const t of types) {
            let res = {...base, ...manifest[t]};
            let conf = (res.configuration)?res.configuration:{};
            if ( manifest.params ){
              conf = {...conf, ...manifest.params};
            }
            res.configuration = objectToCSV(conf);
            fw[t].push(res);
        };
    }

    core.setOutput('ncp_matrix', fw['ncp-uart-hw']);
    core.setOutput('rcp_matrix', fw['rcp-uart-802154']);
    core.setOutput('ot_matrix', fw['ot-rcp']);
    return "Processing complete";
}

main()
  .then((msg) => {
    console.log(msg);
  })
  .catch((err) => {
    core.setFailed(err.message);
  });
