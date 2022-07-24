export const helloWorld = `module.exports = async (context) => {
  const { Builder, By, until } = require("selenium-webdriver");
  let { 
    driver,
    args,
    options
  } = context;
  await driver.get(args.openUrl);
  let searchText = args.keyword;
  let searchEdit = driver.findElement(By.id("kw"));
  driver.executeScript("arguments[0].value=arguments[1];", searchEdit, searchText);
  await new Promise((res) => setTimeout(res, 1000));
  let search = await driver.findElement(By.id("su"));
  driver.executeScript("arguments[0].click();", search);
  await new Promise((res) => setTimeout(res, 5000));
  return {
    code: 0,
    data: args.keyword,
    message: "ok"
  };
} ;`
