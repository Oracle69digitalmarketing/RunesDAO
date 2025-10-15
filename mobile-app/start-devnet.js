const {Devnet} = require('starknet-devnet');

async function main() {
  const devnet = await Devnet.spawnVersion('v0.6.0', {
    args: ['--seed', '0'],
    keepAlive: true,
  });
  console.log(`Starknet Devnet listening on ${devnet.provider.url}`);
}

main();
