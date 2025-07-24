import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequest,
  getMyConnectionsRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
const ViewProfilePage = ({ userProfile }) => {
  console.log("outside useeffe");
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const searchParams = useSearchParams();
  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionRequest({
        token: localStorage.getItem("token"),
      })
    );
    await dispatch(
      getMyConnectionsRequests({
        token: localStorage.getItem("token"),
      })
    );
  };
  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }

    if (
      authState.connectionRequest.some(
        (user) => user.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequest.find(
          (user) => user.userId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  useEffect(() => {
    getUsersPost();
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      className={styles.connectButton}
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          })
                        );
                      }}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div style={{ paddingBlock: "1.2rem" }}>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {/* {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`}></img>
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })} */}

                {userPosts.length === 0 ? (
                  <p style={{ textAlign: "center", color: "gray" }}>
                    No posts available
                  </p>
                ) : (
                  userPosts.map((post) => {
                    console.log(userPosts);
                    const formattedDate = new Date(
                      post.createdAt
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <img
                                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                alt="User"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <strong>{userProfile.userId.name}</strong>
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "gray",
                                  }}
                                >
                                  {userProfile.userId.username}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{ fontSize: "0.8rem", color: "gray" }}
                              >
                                {formattedDate}
                              </div>
                            </div>
                          </div>

                          {/* Body */}
                          <p style={{ marginTop: "0.5rem" }}>{post.body}</p>

                          {/* Post Image */}
                          {post.media && (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt="Post"
                              style={{
                                width: "100%",
                                marginTop: "0.5rem",
                                borderRadius: "0.5rem",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className={styles.profileSection}>
            {/* Work History */}
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>💼 Work History</h2>
              </div>
              <div className={styles.cardGrid}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.infoCard}>
                    <h3>
                      {work.company} - <span>{work.position}</span>
                    </h3>
                    <p>🕒 {work.years} years</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education History */}
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🎓 Education History</h2>
              </div>
              <div className={styles.cardGrid}>
                {userProfile.education.map((edu, index) => (
                  <div key={index} className={styles.infoCard}>
                    <h3>
                      {edu.school} - <span>{edu.degree}</span>
                    </h3>
                    <p>📚 {edu.fieldOfStudy}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default ViewProfilePage;
export async function getServerSideProps(context) {
  console.log("outside ssr");
  console.log(context.query.username);
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );

  return { props: { userProfile: request.data.profile } };
}
