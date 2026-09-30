import { forbidden, notFound } from "../utils/errors.js";
import Company from "../models/Company.js";

export async function requireCompanyAdmin(req, res, next) {
  try {
    if (req.user.role !== "company_admin" || !req.user.companyId) {
      throw forbidden("Company admin access required", "FORBIDDEN");
    }
    const company = await Company.findOne({ _id: req.user.companyId, status: "active" });
    if (!company) throw notFound("Company workspace not found or inactive", "WORKSPACE_UNAVAILABLE");
    req.company = company;
    next();
  } catch (error) {
    next(error);
  }
}
