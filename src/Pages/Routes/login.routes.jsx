import { LoginPage } from "../Auth/Login/LoginPage";
import { CreateAccountPage } from "../Auth/Register/CreateAccountPage";
import { AccountRecoveryPage} from "../Auth/Recovery/AccountRecoveryPage";
import { VerifyAccountPage } from "../Auth/Verfiy/VerifyAccountPage";
  

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
