import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    dispatch(registerUser({ name, username, email, password }));
  };
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (authState.loogedIn) {
      router.push("/dashboard");
    }
  });
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message?.message || authState.message || ""}
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <input
                className={styles.inputField}
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={styles.inputField}
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            {userLoginMethod ? (
              <p>Don't have an account</p>
            ) : (
              <p>Already have an account? </p>
            )}

            <div
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              className={styles.buttonWithOutline}
              style={{ color: "black", textAlign: "center" }}
            >
              <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
