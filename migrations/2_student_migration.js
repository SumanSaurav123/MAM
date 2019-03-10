const Initial = artifacts.require("Initial");

module.exports = function(deployer) {

    deployer.deploy(Initial,100000).then(() => {
    });
};
