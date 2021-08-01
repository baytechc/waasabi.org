import { parse } from 'https://deno.land/std@0.95.0/encoding/yaml.ts'

const DUMMY = false;
const LOG = true;


try {
  const yaml = Deno.readTextFileSync(Deno.args[0]);
  const parsed = parse(yaml);

  for (const task of parsed) {
    let stdin;

    if (LOG) console.log(`\n[${task.name}] ${task.desc}`);

    if (task.skip && LOG) console.log(task.skip);

    if (!task.run?.length) continue;

    for (let cmd of task.run) {
      let owner; /* default owner: no change (root) */
      let cwd; /* working directory, default: no change */
      let pipeinto; /* pipe command output into specified tool or next command */

      // Match special command
      do {
        const [,command,param] = cmd[0]?.match(/^@(\w+)(?::(.*))?/) ?? [];
        if (!command) break;

        // @as: execute as the specified user (defaults to 'root')
        if (command === 'as') {
          cmd.shift();
          owner = param;

        // @writefile: create a new file with the specified contents
        } else if (command === 'writefile') {
          cmd.shift();

          const [contents] = cmd;
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
            pipeinto = param;

          // Buffer command output and pipe it into the next command
          } else {
            pipeinto = true;

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
        console.log(cmd.join(' ') + (pipeinto ? ' | '+pipeinto : '' ));
      }

      if (!DUMMY) {
        const taskdesc = {
          cmd,
          cwd,
          stdin: 'piped',
          stdout: 'piped',
          stderr: 'piped',
        };
        const proc = Deno.run(taskdesc);

        let presult;
        const outfile = `/var/log/private/${Date.now()}_${task.name}_${cmd[0]}_out.log`;
        const errfile = `/var/log/private/${Date.now()}_${task.name}_${cmd[0]}_err.log`;

        if (pipeinto && pipeinto !== true) {
          const pipeproc = Deno.run({
            cmd: pipeinto.split(' '),
            stdin: 'piped',
            stdout: 'piped',
            stderr: 'piped',
          });

          const pipes = await pipe(proc, pipeproc);
          console.log(pipes);

          presult = pipes[1];
        } else {
          const outlog = await Deno.open(outfile, { write: true, create: true });
          const errlog = await Deno.open(errfile, { write: true, create: true });

          Deno.copy(proc.stdout, outlog).then(_ => outlog.close());
          Deno.copy(proc.stderr, errlog).then(_ => errlog.close());

          presult = await proc.status();
        }
        // TODO: pipe === true

        if (!presult.success) {
          //console.error(taskdesc);
          //console.error(proc);
          console.error(`[!] Task failed with code ${presult.code}:`);
          console.error(Deno.readTextFileSync(errfile));
          console.error('More details may be found in:\n'+outfile);
          throw new Error(`Aborting due to failed task: ${task.name}`);
        }
      }
    } // end of run[] loop

    // Tasks succeeded
    console.log(task.success);
  }

  Deno.exit(0);

} catch (e) {
  console.error(e);

  Deno.exit(1);
}



function ids(user) {
  const { uid, gid } = Deno.statSync(`/home/${user}`);
  return { uid, gid };
}

function own(file, user) {
  const { uid, gid } = ids(user);

  Deno.chownSync(file, uid, gid);
}

function create(file, contents, user) {
  // Ensure directory exists
  const dir = file.substr(0, file.lastIndexOf('/'));

  if (dir) {
    Deno.mkdirSync(dir, { recursive: true });

    if (user) own(dir, user);
  }

  // Write contents
  Deno.writeTextFileSync(file, contents);

  if (user) own(file, user);
}

async function pipe(p1, p2) {
  let copied;
  do {
    copied = await Deno.copy(p1.stdout,p2.stdin);
  } while (copied > 0);

  const p1s = await p1.status();
  if (!p1s.success) throw new Error({ message: 'Pipe source error!', status: p1s });

  p2.stdin.close();

  const p2s = await p2.status();

  return [ p1s, p2s ];
}
