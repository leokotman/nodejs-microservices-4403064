const semver = require("semver");

class Registry {
  constructor() {
    this.services = {}; // Change to object instead of array
    this.timeout = 15;
  }

  // eslint-disable-next-line class-methods-use-this
  getKey(name, version, ip, port) {
    return `${name}-${version}-${ip}-${port}`;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        console.log(
          "Cleaning up service:",
          this.services[key],
          "remove expired service with key: ",
          key
        );
        delete this.services[key];
      }
    });
  }

  getService(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name, version, ip, port) {
    this.cleanup();
    const key = this.getKey(name, version, ip, port);

    // Create or update service entry
    this.services[key] = {
      name,
      version,
      ip,
      port,
      timestamp: Math.floor(Date.now() / 1000)
    };

    console.log("Service registered:", this.services[key]);
    return key;
  }

  unregisterService(name, version, ip, port) {
    const key = this.getKey(name, version, ip, port);

    console.log("Unregistering service:", this.services[key]);
    delete this.services[key];
    console.log("Unregistering service:", key);
    return key;
  }

  findService(name, version) {
    return Object.values(this.services).find(
      (service) => service.name === name && service.version === version
    );
  }
}

module.exports = Registry;
