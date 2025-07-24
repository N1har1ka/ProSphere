import { BASE_URL } from "@/config";
import {
  AcceptConnection,
  getMyConnectionsRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { connection } from "next/server";

const MyConnectionsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(
      getMyConnectionsRequests({ token: localStorage.getItem("token") })
    );
  }, []);
  useEffect(() => {
    if (authState.connectionRequest.length !== 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h4>My Connections</h4>
          {authState.connectionRequest.length === 0 && (
            <h1>No connection request pending</h1>
          )}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div className={styles.userCard} key={index}>
                    <div
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            AcceptConnection({
                              token: localStorage.getItem("token"),
                              connectionId: user._id,
                              action_type: "accept",
                            })
                          );
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}

          <h4>My Network</h4>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div className={styles.userCard} key={index}>
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h1>{user.userId.name}</h1>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default MyConnectionsPage;
