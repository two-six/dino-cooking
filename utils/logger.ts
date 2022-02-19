import * as log from 'https://deno.land/std@0.126.0/log/mod.ts';

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),

    file: new log.handlers.FileHandler("INFO", {
      filename: "./log.txt",
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
    steps: {
      level: "INFO",
      handlers: ["console", "file"],
    },
  },
});

const steps = log.getLogger("steps");
const def = log.getLogger();
export default {
  steps,
  def
};