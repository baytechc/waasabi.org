// deno run --allow-read --allow-run https://waasabi.org/code/init@0.0.1/init.js ./waasabi-init.yml

import { parse } from 'https://deno.land/std@0.95.0/encoding/yaml.ts'

let DUMMY = true;
let LOG = true;


try {
  const yaml = Deno.readTextFileSync(Deno.args[0]);
  const parsed = parse(yaml);

  for (let task of parsed) {
    let stdin;

    if (LOG) console.log(`\n[${task.name}] ${task.desc}`);

    for (let cmd of task.run) {
      let owner; /* default owner: no change (root) */
      let cwd; /* working directory, default: no change */
      let pipe; /* pipe command output into specified tool or next command */

      // Match special command
      do {
        let [,command,param] = cmd[0]?.match(/^@(\w+)(?::(.*))?/) ?? [];
        if (!command) break;

        // @as: execute as the specified user (defaults to 'root')
        if (command === 'as') {
          cmd.shift();
          owner = param;

        // @writefile: create a new file with the specified contents
        } else if (command === 'writefile') {
          cmd.shift();

          let [contents] = cmd;
          cmd.shift();

          if (LOG) {
            console.log(`\n${param} created:\n|\t` + contents.trim().replace(/\n/g,'\n|\t'));
          }

          if (!DUMMY) {
            Deno.writeTextFile(param.substr(1), contents);
            //TODO:owner

          }

          continue;

        // @dir: set current directory (cwd)
        } else if (command === 'dir') {
          cmd.shift();
          cwd = param;

          if (LOG) {
            console.log('cd ' +param+ ' # switched cwd');
          }

          if (!DUMMY) {
            Deno.chdir(param);

          }

          continue;


        // @pipe: pipe command output into another executable, or the next command
        } else if (command === 'pipe') {
          cmd.shift();

          // The parameter holds the pipe target, e.g.: [ @pipe:bash, pwd ]
          if (param) {
            pipe = param;

          // Buffer command output and pipe it into the next command
          } else {
            pipe = true;

          }

          if (LOG) {
            console.log('cd ' +param+ ' # switched cwd');
          }

          if (!DUMMY) {
            Deno.chdir(param);

          }

          continue;

        } else {
          console.log('[!] Unrecognized command: '+command);
          cmd.shift();
        }

      // Process all special commands before moving on
      } while(cmd[0]?.startsWith('@'));

      // Nothing left to process
      if (!cmd.length) continue;

      if (owner) {
        cmd = [ 'sudo', '-u'+owner, '--' ].concat(cmd)
      }

      if (LOG) {
        console.log(cmd.join(' ') + (pipe ? ' | '+pipe : '' ));
      }

      if (!DUMMY) {
        const proc = Deno.run({
          cmd,
          cwd,
          stdout: 'piped'
        });
        console.log(proc);
        // TODO: capture process stdout/stderr

        let presult;
        if (pipe && pipe !== true) {
          const pipeproc = Deno.run({
            cmd: [pipe],
            stdin: 'piped'
          });

          Deno.copy(proc.stdout, pipeproc.stdin);

          presult = await pipeproc.status();
        } else {
          presult = await proc.status();

        }
        // TODO: pipe === true

        console.log(presult);
      }
    }
  }
}
catch (e) {
  console.error(e);
}

