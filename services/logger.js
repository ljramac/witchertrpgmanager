const logger = {
  log: (message, type, options) => {
    try {
      const payload = {
        timestamp: Date.now(),
        message: message.toString(),
        ...options ? options : {}
      };

      if (typeof message === "object") {
        payload.code = message.code || "";
        payload.message = message.message || "";

        if (message instanceof Error) {
          payload.message = message.errorMessage || payload.message;

          if (message.stack) {
            const _stack = message.stack.toString();

            const lines = _stack.split(/\n/);

            if (lines.length) {
              const line = lines.find(l => /(at )/.test(l));

              if (line) {
                payload.line = line.replace(/(.*at )/, "");
              }
            }
          }
        } else {
          Object.assign(payload, message);
        }
      }

      const logMesssage = JSON.stringify(payload);

      console.log(logMesssage);
    } catch (error) {
      console.error(error);
    }
  },
  info: (message, options) => logger.log(message, "info", options),
  debug: (message, options) => logger.log(message, "debug", options),
  warn: (message, options) => logger.log(message, "warn", options),
  error: (message, options) => logger.log(message, "error", options),
};

module.exports = logger;
