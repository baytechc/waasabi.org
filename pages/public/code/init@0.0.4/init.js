// deno run --allow-read --allow-run https://waasabi.org/code/init@0.0.3/init.js ./waasabi-init.yml

import { parse } from 'https://deno.land/std@0.95.0/encoding/yaml.ts'

let DUMMY = false;
let LOG = true;


try {
  const yaml = Deno.readTextFileSync(Deno.args[0]);
  const parsed = parse(yaml);

  for (let task of parsed) {
    let stdin;

    if (LOG) console.log(`\n[${task.name}] ${task.desc}`);

    if (task.skip && LOG) console.log(task.skip);

    if (!task.run?.length) continue;

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
            console.log(`\nWriting ${param}:\n|\t` + contents.trim().replace(/\n/g,'\n|\t'));
          }

          if (!DUMMY) {
            create(param, contents, owner)
          
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
          stdin: 'piped',
          stdout: 'piped',
          stderr: 'piped',
        });
        console.log(proc);
        // TODO: capture process stdout/stderr

        let presult;
        if (pipe && pipe !== true) {
          const pipeproc = Deno.run({
            cmd: pipe.split(' '),
            stdin: 'piped',
            stdout: 'piped',
            stderr: 'piped',
            });

          await Deno.copy(proc.stdout, pipeproc.stdin);

          let pipes = [
            pipeproc.status(),
            proc.status()
          ];

          presult = await Promise.race(pipes);
          console.log(pipes);

        } else {
          let outlog = await Deno.open(`/var/log/private/${Date.now()}_${task.name}_${cmd[0]}_out.log`, { write: true, create: true });
          let errlog = await Deno.open(`/var/log/private/${Date.now()}_${task.name}_${cmd[0]}_err.log`, { write: true, create: true });

          Deno.copy(proc.stdout, outlog).then(_ => outlog.close());
          Deno.copy(proc.stderr, errlog).then(_ => errlog.close());

          presult = await proc.status();
        }
        // TODO: pipe === true

        console.log(presult);

        if (!presult.success) {
          throw new Error(`Task failed: ${task.name}`);
        }

        if (presult.success) {
          console.log(task.success);
        }
      }
    }
  }

  Deno.exit(0);

} catch (e) {
  console.error(e);

  Deno.exit(1);
}



function ids(user) {
  let { uid, gid } = Deno.statSync(`/home/${user}`);
  return { uid, gid };
}

function own(file, user) {
  let { uid, gid } = ids(user);

  Deno.chownSync(file, uid, gid);
}

function create(file, contents, user) {
  // Ensure directory exists
  let dir = file.substr(0, file.lastIndexOf('/'));

  if (dir) {
    Deno.mkdirSync(dir, { recursive: true });

    if (user) own(dir, user);
  }

  // Write contents
  Deno.writeTextFileSync(file, contents);

  if (user) own(file, user);
}

