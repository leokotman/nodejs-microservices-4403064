const express = require("express");

const Registry = require("../lib/Registry");

const registry = new Registry();

const router = express.Router();

function getRequestArgs(req) {
  const { servicename, serviceversion, serviceport } = req.params;
  let serviceIp = req.ip;
  if (serviceIp.includes("::1") || serviceIp.includes("::ffff:127.0.0.1")) {
    serviceIp = "127.0.0.1";
  }
  return { servicename, serviceversion, serviceport, serviceIp };
}

router.put(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceport, serviceIp } =
      getRequestArgs(req);
    const key = registry.register(
      servicename,
      serviceversion,
      serviceIp,
      serviceport
    );

    return res.json({ result: key });
  }
);

router.delete(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceport, serviceIp } =
      getRequestArgs(req);
    const key = registry.unregisterService(
      servicename,
      serviceversion,
      serviceIp,
      serviceport
    );
    return res.json({ result: key });
  }
);

router.get("/find/:servicename/:serviceversion/", (req, res, next) => {
  const { servicename, serviceversion } = req.params;
  const service = registry.getService(servicename, serviceversion);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  return res.json(service);
});

module.exports = router;
