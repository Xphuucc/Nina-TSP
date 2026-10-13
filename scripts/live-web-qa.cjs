const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const base = "https://xphuucc.github.io/Nina-TSP/";
const results = [], pageErrors = [], failedRequests = [];
const out = path.resolve("web-qa-results");
async function check(name, fn) {
  try { await fn(); results.push({name, status:"passed"}); console.log("PASS", name); }
  catch (error) { results.push({name, status:"failed", error:String(error)}); console.error("FAIL", name, String(error)); }
}
(async () => {
  await fs.mkdir(out, {recursive:true});
  const browser = await chromium.launch();
  const context = await browser.newContext({viewport:{width:1440,height:1000}, acceptDownloads:true});
  const page = await context.newPage();
  page.on("pageerror", e => pageErrors.push(String(e)));
  page.on("requestfailed", r => failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  const response = await page.goto(base + "?webqa=" + Date.now(), {waitUntil:"networkidle", timeout:60000});
  await check("Live page loads and Phuc is Planner", async () => {
    assert.equal(response.status(),200);
    await page.locator(".workspace").waitFor();
    assert.equal((await page.locator(".user-chip small").innerText()).trim(),"Planner");
    assert.equal(await page.getByText("Chủ agency",{exact:true}).count(),0);
    for (const img of await page.locator("img").all()) {
      assert.equal(await img.evaluate(el => el.complete && el.naturalWidth > 0),true,"Logo did not load");
    }
    await page.screenshot({path:path.join(out,"desktop-overview.png"),fullPage:true});
  });
  await check("Dashboard business-line and date filters change metrics", async () => {
    const before = await page.locator(".metric-card").allTextContents();
    await page.getByLabel("Lọc business line").selectOption("MCN");
    await page.getByLabel("Lọc kỳ báo cáo").selectOption("7");
    const after = await page.locator(".metric-card").allTextContents();
    assert.notDeepEqual(after,before,"Metric cards did not change");
    await page.getByLabel("Lọc business line").selectOption("Tất cả");
    await page.getByLabel("Lọc kỳ báo cáo").selectOption("30");
  });
  await check("Company Agents navigation exposes seven correct named roles", async () => {
    await page.getByRole("button",{name:"Agents công ty",exact:true}).click();
    await page.getByRole("heading",{name:"Trợ lý cho nhân viên và BOD"}).waitFor();
    for (const name of ["Nina Nguyen · CEO","Thuc Huynh · Deputy CEO","Phuc Nguyen · Planner","Nam Tran · KOL Management","Tri Pham · Head of Socom","Huong Le · Head of Growth","Lin Huynh · Finance Manager"]) {
      assert.equal(await page.getByRole("button",{name,exact:true}).count(),1);
    }
    assert.equal(await page.getByRole("button",{name:/Minh Tri/}).count(),0);
  });
  await check("Each employee role switches and generates a labeled local workflow", async () => {
    for (const name of ["Nam Tran · KOL Management","Tri Pham · Head of Socom","Huong Le · Head of Growth","Lin Huynh · Finance Manager"]) {
      await page.getByRole("button",{name,exact:true}).click();
      await page.getByRole("button",{name:/Dùng tình huống mẫu:/}).click();
      assert.ok((await page.locator("#company-agent-request").inputValue()).length > 0);
      await page.getByRole("button",{name:"Xem kịch bản hỗ trợ",exact:true}).click();
      assert.ok((await page.locator(".cap-detail").last().innerText()).includes("chưa gọi model"));
      assert.ok((await page.locator(".cap-detail").last().innerText()).includes("Chưa có evidence thực tế"));
    }
    await page.screenshot({path:path.join(out,"desktop-team-agents.png"),fullPage:true});
  });
  await check("Data/API explorer has 28 groups and working department filters", async () => {
    await page.getByRole("button",{name:"Dữ liệu & API",exact:true}).click();
    assert.equal(await page.locator(".cap-item").count(),28);
    const controls = page.locator(".cap-controls select");
    await controls.nth(1).selectOption("Growth");
    assert.equal(await page.locator(".cap-item").count(),1);
    assert.ok((await page.locator(".cap-detail").innerText()).includes("Lead & pipeline"));
    await controls.nth(1).selectOption("Tất cả");
    await controls.nth(0).selectOption("TSP");
    await controls.nth(2).selectOption("blocked");
    assert.equal(await page.locator(".cap-item").count(),1);
    await page.getByRole("button",{name:"Phase 2 · API sync",exact:true}).click();
    assert.ok((await page.locator(".cap-detail").innerText()).includes("Không dùng endpoint này cho VN"));
    await controls.nth(0).selectOption("Tất cả");
    await controls.nth(2).selectOption("Tất cả");
    await page.screenshot({path:path.join(out,"desktop-data-api.png"),fullPage:true});
  });
  await check("BOD drawer opens, answers sample question and closes", async () => {
    await page.getByLabel("Mở BOD Assistant").click();
    await page.getByRole("heading",{name:"Nina BOD Assistant",exact:true}).waitFor();
    await page.locator(".assistant-suggestions button").first().click();
    assert.ok((await page.locator(".assistant-answer").first().innerText()).length>30);
    await page.getByLabel("Đóng BOD Assistant").click();
    assert.equal(await page.locator(".assistant-drawer").count(),0);
  });
  await check("Existing pages remain navigable", async () => {
    for (const name of ["Phân tích","Khách hàng","Creator & đối tác","Chiến dịch TAP","Sản phẩm","Tài chính","Kết nối & quyền","Tổng quan"]) {
      await page.locator(".sidebar nav").getByRole("button",{name,exact:true}).click();
      assert.ok((await page.locator(".page-content").innerText()).length>80);
    }
  });
  await check("Mobile menu opens new pages at 390px without page overflow", async () => {
    await page.setViewportSize({width:390,height:844});
    await page.getByLabel("Mở điều hướng").click();
    await page.locator(".sidebar nav").getByRole("button",{name:"Agents công ty",exact:true}).click();
    await page.getByRole("heading",{name:"Trợ lý cho nhân viên và BOD"}).waitFor();
    const bounds = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(bounds.scroll <= bounds.width + 2,JSON.stringify(bounds));
    await page.screenshot({path:path.join(out,"mobile-team-agents.png"),fullPage:true});
    await page.getByLabel("Mở điều hướng").click();
    await page.locator(".sidebar nav").getByRole("button",{name:"Dữ liệu & API",exact:true}).click();
    const b = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(b.scroll <= b.width + 2,JSON.stringify(b));
    await page.screenshot({path:path.join(out,"mobile-data-api.png"),fullPage:true});
  });
  await check("No uncaught JavaScript exceptions", async () => assert.deepEqual(pageErrors,[]));
  await fs.writeFile(path.join(out,"results.json"),JSON.stringify({url:base,testedAt:new Date().toISOString(),results,pageErrors,failedRequests},null,2));
  await context.close(); await browser.close();
  console.log(JSON.stringify(results,null,2));
  if(results.some(r=>r.status==="failed")) process.exitCode=1;
})().catch(async error => {
  console.error(error);
  await fs.mkdir(out,{recursive:true});
  await fs.writeFile(path.join(out,"fatal.txt"),String(error));
  process.exitCode=1;
});
