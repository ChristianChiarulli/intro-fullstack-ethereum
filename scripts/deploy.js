async function main() {
  // We get the contract to deploy
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const greeter = await SimpleStorage.deploy(789);

  // NOTE: All Contracts have an associated address
  console.log("SimpleStorage deployed to:", greeter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
