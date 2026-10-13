import { describe, expect, it } from "vitest";
import { companyTeam, hasCompanyGrant } from "../shared/companyTeam";
describe("Nina requested team grants", () => {
  it("gives CEO, Deputy CEO and Planner full read/manage grants", () => {
    for (const id of ["nina-nguyen", "thuc-huynh", "phuc-nguyen"]) {
      for (const resource of ["administration", "leads", "invoices", "cashflow", "booking"] as const) {
        expect(hasCompanyGrant(id, resource, "read")).toBe(true);
        expect(hasCompanyGrant(id, resource, "manage")).toBe(true);
      }
    }
    expect(companyTeam.find(member => member.id === "phuc-nguyen")?.title).toBe("Planner");
  });
  it("keeps KOL and Socom privileges out of administration and raw finance", () => {
    expect(hasCompanyGrant("nam-tran", "booking", "manage")).toBe(true);
    expect(hasCompanyGrant("nam-tran", "campaign", "manage")).toBe(false);
    expect(hasCompanyGrant("tri-pham", "livestream", "manage")).toBe(true);
    for (const id of ["nam-tran", "tri-pham"]) {
      expect(hasCompanyGrant(id, "invoices", "read")).toBe(false);
      expect(hasCompanyGrant(id, "administration", "manage")).toBe(false);
    }
  });
  it("separates Growth leads from Finance invoices and cashflow", () => {
    expect(hasCompanyGrant("huong-le", "leads", "manage")).toBe(true);
    expect(hasCompanyGrant("huong-le", "cashflow", "read")).toBe(false);
    expect(hasCompanyGrant("lin-huynh", "invoices", "manage")).toBe(true);
    expect(hasCompanyGrant("lin-huynh", "cashflow", "manage")).toBe(true);
    expect(hasCompanyGrant("lin-huynh", "leads", "manage")).toBe(false);
  });
  it("denies unknown identities", () => {
    expect(hasCompanyGrant("unknown", "overview", "read")).toBe(false);
  });
});
