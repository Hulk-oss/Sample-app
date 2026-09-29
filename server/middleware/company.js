import { unauthorized } from "../utils/errors.js";
import Company from "../models/Company.js";

export async function requireCompanyAdmin(req, res, next) {
  try {
    if (req.user.role !== "company_admin" || !req.user.companyId) {
      throw unauthorized("Company admin access required");
    }
    const company = await Company.findOne({ _id: req.user.companyId, status: "active" });
    if (!company) throw unauthorized("Company workspace is unavailable");
    req.company = company;
    next();
  } catch (error) {
    next(error);
  }
}
