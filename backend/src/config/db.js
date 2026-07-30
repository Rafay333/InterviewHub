const { env } = require("./env");

// Windows Authentication needs msnodesqlv8 + ODBC Driver 17
const sql = env.dbTrustedConnection
  ? require("mssql/msnodesqlv8")
  : require("mssql");

let poolPromise = null;

function buildConfig() {
  if (!env.dbTrustedConnection) {
    return env.db;
  }

  // Local named instances often use Shared Memory (sqlcmd works; TCP may be off).
  // lpc: = local shared-memory protocol for ODBC
  let server = env.db.server || ".\\ABDULRAFAY";
  server = server.replace(/\\\\/g, "\\");
  if (!server.toLowerCase().startsWith("lpc:")) {
    // .\INSTANCE or HOST\INSTANCE → lpc:.\INSTANCE
    if (server.includes("\\")) {
      const instance = server.split("\\").pop();
      server = `lpc:.\\${instance}`;
    } else {
      server = `lpc:${server}`;
    }
  }

  const database = env.db.database;
  const connectionString = [
    "Driver={ODBC Driver 17 for SQL Server}",
    `Server=${server}`,
    `Database=${database}`,
    "Trusted_Connection=Yes",
    "TrustServerCertificate=Yes",
  ].join(";");

  console.log(`[db] Using ODBC Server=${server}; Database=${database}; Windows Auth`);

  return {
    connectionString,
    pool: env.db.pool,
  };
}

function getPool() {
  if (!poolPromise) {
    const mode = env.dbTrustedConnection
      ? "Windows Authentication"
      : `SQL login (${env.db.user})`;
    const config = buildConfig();

    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log(
          `[db] Connected to ${env.db.server}/${env.db.database} via ${mode}`,
        );
        return pool;
      })
      .catch((err) => {
        poolPromise = null;
        console.error("[db] Connection failed:", err.message);
        throw err;
      });
  }
  return poolPromise;
}

async function query(text, inputs = {}) {
  const pool = await getPool();
  const request = pool.request();
  for (const [key, value] of Object.entries(inputs)) {
    if (value && typeof value === "object" && "type" in value && "value" in value) {
      request.input(key, value.type, value.value);
    } else {
      request.input(key, value);
    }
  }
  return request.query(text);
}

module.exports = {
  sql,
  getPool,
  query,
};
