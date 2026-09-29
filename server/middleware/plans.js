import Company from "../models/Company.js";
import { getUserPlan, getCompanyPlan } from "../pricing.js";
import { validation } from "../utils/errors.js";

export async function requireUserFeature(feature) {
  return async function userFeatureMiddleware(req, res, next) {
    try {
      if (req.user.role !== "user") return next();
      const user = req.user.companyId ? req.user : req.user;
      let allowed = false;

      if (req.user.companyId) {
        const company = await Company.findById(req.user.companyId).lean();
        const companyPlan = getCompanyPlan(company);
        allowed = companyPlan.features.includes(feature);
      } else {
        const plan = getUserPlan(user);
        allowed = Boolean(plan?.features.includes(feature));
      }

      if (!allowed) {
        throw validation("This feature is not included in your current plan.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export async function requireCompanyFeature(feature) {
  return async function companyFeatureMiddleware(req, res, next) {
    try {
      const plan = getCompanyPlan(req.company);
      if (!plan.features.includes(feature)) {
        throw validation("This organization feature is not included in the current plan.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
