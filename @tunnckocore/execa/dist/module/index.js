import execa from 'execa';
import pMap from 'p-map';
export async function exec(cmds, options) {
  const commands = [].concat(cmds).filter(Boolean);
  const {
    concurrency = Infinity,
    ...opts
  } = {
    preferLocal: true,
    ...options
  };
  return pMap(commands, cmd => execa.command(cmd, opts), {
    concurrency
  });
}
export function shell(cmds, options) {
  return exec(cmds, { ...options,
    shell: true
  });
}
export default execa;