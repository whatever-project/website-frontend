import enCommon from "./en/common.json"
import enLanding from "./en/landing.json"
import enLogin from "./en/login.json"
import enSignup from "./en/signup.json"
import enForgotPassword from "./en/forgot-password.json"
import enResetPassword from "./en/reset-password.json"
import enVerifyEmail from "./en/verify-email.json"
import enVerifyEmailChange from "./en/verify-email-change.json"
import enDashboard from "./en/dashboard.json"
import enAccount from "./en/account.json"
import enAdminLogs from "./en/admin-logs.json"

import thCommon from "./th/common.json"
import thLanding from "./th/landing.json"
import thLogin from "./th/login.json"
import thSignup from "./th/signup.json"
import thForgotPassword from "./th/forgot-password.json"
import thResetPassword from "./th/reset-password.json"
import thVerifyEmail from "./th/verify-email.json"
import thVerifyEmailChange from "./th/verify-email-change.json"
import thDashboard from "./th/dashboard.json"
import thAccount from "./th/account.json"
import thAdminLogs from "./th/admin-logs.json"

export const messages = {
  en: {
    ...enCommon,
    ...enLanding,
    ...enLogin,
    ...enSignup,
    ...enForgotPassword,
    ...enResetPassword,
    ...enVerifyEmail,
    ...enVerifyEmailChange,
    ...enDashboard,
    ...enAccount,
    ...enAdminLogs,
  },
  th: {
    ...thCommon,
    ...thLanding,
    ...thLogin,
    ...thSignup,
    ...thForgotPassword,
    ...thResetPassword,
    ...thVerifyEmail,
    ...thVerifyEmailChange,
    ...thDashboard,
    ...thAccount,
    ...thAdminLogs,
  },
}
