"use client";

import { publicEnv } from "@/lib/env/public";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthInput from "./AuthInput";

function AuthForm() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [visiblity, setVisibility] = useState(false);
  const [confirmVisiblity, setConfirmVisibility] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "") {
      alert("請輸入帳號！");
      return;
    }

    if (password.length < 8) {
      alert("密碼長度至少須為8碼以上！");
      return;
    }

    // if (isSignUp && confirmPassword != password) {
    //   alert("密碼與確認密碼不相符！");
    //   return;
    // }

    signIn("credentials", {
      name,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/main`,
    });
  };

  return (
    <div className="lg:w-1/3 w-1/2 rounded-lg py-10 bg-white ">
      <div className="lg:text-2xl text-lg px-10 font-medium">
        管理者登入
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-16 gap-12 px-10 items-center"
      >
        <div className="flex items-center border border-black rounded-md w-full pl-2">
          <PersonIcon />
          <AuthInput label="帳號" type="text" value={name} setValue={setName} />
        </div>

        <div className="w-full">
          <div className="flex items-center border border-black px-2 rounded-md w-full">
            <LockIcon />
            <AuthInput
              label="密碼"
              type={visiblity ? "text" : "password"}
              value={password}
              setValue={setPassword}
            />
            {visiblity ? (
              <IconButton onClick={() => setVisibility(false)}>
                <VisibilityOffIcon fontSize="large" className="my-auto" />
              </IconButton>
            ) : (
              <IconButton onClick={() => setVisibility(true)}>
                <VisibilityIcon fontSize="large" className="my-auto" />
              </IconButton>
            )}
          </div>

          {password.length < 8 && password.length != 0 && (
            <p className="text-red-500 mt-2 text-sm text-end w-full">
              ＊密碼長度至少須為8碼以上
            </p>
          )}
        </div>

        {/* {isSignUp && (
          <div className="w-full">
            <div className="flex items-center border border-black px-2 rounded-md w-full">
              <LockIcon />
              <AuthInput
                label="確認密碼"
                type={confirmVisiblity ? "text" : "password"}
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
              {confirmVisiblity ? (
                <IconButton onClick={() => setConfirmVisibility(false)}>
                  <VisibilityOffIcon fontSize="large" className="my-auto" />
                </IconButton>
              ) : (
                <IconButton onClick={() => setConfirmVisibility(true)}>
                  <VisibilityIcon fontSize="large" className="my-auto" />
                </IconButton>
              )}
            </div>
            {password !== confirmPassword &&
              confirmPassword.length >= password.length && (
                <p className="text-red-500 mt-2 text-sm text-end w-full">
                  ＊確認密碼和所填密碼不符
                </p>
              )}
          </div>
        )} */}

        {/* <div className="text-sm text-gray-500">
          {isSignUp ? (
            <span>
              已有帳號?{"   "}
              <a
                className="cursor-pointer hover:underline text-column2"
                onClick={() => setIsSignUp(false)}
              >
                前往登入
              </a>
            </span>
          ) : (
            admin_num < 4 && (
              <span>
                尚未註冊?{"   "}
                <a
                  data-testid="sign-in-up-button"
                  className="cursor-pointer hover:underline text-black"
                  onClick={() => setIsSignUp(true)}
                >
                  前往註冊
                </a>
              </span>
            )
          )}
        </div> */}

        <button
          data-testid="auth-submit-button"
          type="submit"
          className="w-1/4 bg-black rounded-lg py-4 lg:text-xl text-sm text-white hover:bg-gray-400"
        >
          {"登入"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;