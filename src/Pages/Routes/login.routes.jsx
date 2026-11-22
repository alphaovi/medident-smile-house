import { AccountRecoveryPage } from "../Login/AccountRecoveryPage";
import { CreateAccountPage } from "../Login/CreateAccountPage";
import { LoginPage } from "../Login/LoginPage";
import { VerifyAccountPage } from "../Login/VerifyAccountPage";

const loginRoutes = [
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/create-login-account",
    element: <CreateAccountPage></CreateAccountPage>
  },
  {
    path: "/forget",
    element: <AccountRecoveryPage></AccountRecoveryPage>
  },
  {
    path: "/verify-account"    ,
    element: <VerifyAccountPage></VerifyAccountPage>
  }
];

export default loginRoutes;
