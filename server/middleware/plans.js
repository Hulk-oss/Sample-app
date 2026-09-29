import Company from "../models/Company.js";
import { getUserPlan, getCompanyPlan } from "../pricing.js";
import { validation } from "../utils/errors.js";

export function requireUserFeature(feature) {
  return async function userFeatureMiddleware(req, res, next) {
    try {
      let allowed = false;

      if (req.user.companyId) {
        const company = await Company.findById(req.user.companyId).lean();
        allowed = getCompanyPlan(company).features.includes(feature);
      } else {
        allowed = getUserPlan(req.user).features.includes(feature);
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

export function requireCompanyFeature(feature) {
  return function companyFeatureMiddleware(req, res, next) {
    try {
      if (!getCompanyPlan(req.company).features.includes(feature)) {
        throw validation("This organization feature is not included in the current plan.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
